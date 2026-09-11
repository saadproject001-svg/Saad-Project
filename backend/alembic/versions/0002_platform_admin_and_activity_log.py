"""Platform super-admin foundation + activity log.

Adds a single `users.is_platform_admin` flag (not a per-org role — this is a
cross-tenant, platform-operator concept) and the session-variable + RLS-policy
mechanism that lets a flagged user's requests see across every organization,
mirroring the exact `app.current_org_id` precedent from 0001 rather than
inventing a new one: `app.dependencies.get_platform_admin_db` sets
`SET LOCAL app.is_platform_admin = 'true'` only after verifying the flag on the
caller's own `users` row, and every table an admin needs to see gets an
additional permissive, SELECT-only `platform_admin_bypass_<table>` policy keyed
off that session variable. SELECT-only is deliberate: admin mutations of other
orgs' data should go through narrow, explicit, audited service functions later
if ever needed, not a blanket write bypass.

Also introduces `activity_log`, the backing table for "what is every user doing
across the platform" — organization_id is nullable because some events (login)
aren't org-scoped.

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-11

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("alter table users add column is_platform_admin boolean not null default false")

    # -----------------------------------------------------------------------
    # activity_log — records real user actions (login, org/team changes,
    # product/inventory/order writes) for the platform admin's activity feed.
    # organization_id is nullable: some events (e.g. AUTH_LOGIN) precede any org
    # context. actor_user_id is nullable via ON DELETE SET NULL so a deleted
    # user's history isn't destroyed, matching the invited_by_user_id pattern in
    # 0001's invitations table.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table activity_log (
            id               uuid primary key default gen_random_uuid(),
            organization_id  uuid references organizations(id) on delete cascade,
            actor_user_id    uuid references users(id) on delete set null,
            event_type       text not null,
            summary          text not null,
            metadata         jsonb,
            created_at       timestamptz not null default now()
        )
        """
    )
    op.execute("create index idx_activity_log_org on activity_log(organization_id)")
    op.execute("create index idx_activity_log_actor on activity_log(actor_user_id)")
    op.execute("create index idx_activity_log_created_at on activity_log(created_at desc)")

    op.execute("alter table activity_log enable row level security")
    op.execute("alter table activity_log force row level security")

    # Every activity_log insert is written by app.services.activity_service.log_activity()
    # on behalf of the currently-authenticated session, so `actor_user_id` always
    # equals app.current_user_id at insert time regardless of whether the session is
    # org-scoped (get_db) or plain (get_plain_db, e.g. the AUTH_LOGIN event) — using
    # the actor identity (not organization_id) as the with-check keeps one insert
    # policy correct for both session kinds.
    op.execute(
        """
        create policy activity_log_insert on activity_log for insert
        with check (actor_user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    # A member can see their own org's activity...
    op.execute(
        """
        create policy activity_log_org_select on activity_log for select
        using (organization_id in (
            select organization_id from team_memberships
            where user_id = current_setting('app.current_user_id', true)::uuid
        ))
        """
    )
    # ...and always their own actions, including org-less events like AUTH_LOGIN.
    op.execute(
        """
        create policy activity_log_self_select on activity_log for select
        using (actor_user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )

    # -----------------------------------------------------------------------
    # Platform-admin cross-tenant SELECT bypass. current_setting(..., true)
    # returns NULL when app.is_platform_admin was never set for this session
    # (the ordinary case for every non-admin request), and NULL::boolean is
    # NULL, so `NULL is true` is false — fails closed exactly like the
    # app.current_org_id checks elsewhere. Postgres ORs multiple permissive
    # policies for the same command, so this only ever widens visibility for a
    # flagged admin session; it changes nothing for ordinary tenant requests.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create policy platform_admin_bypass_activity_log on activity_log for select
        using (current_setting('app.is_platform_admin', true)::boolean is true)
        """
    )
    op.execute(
        """
        create policy platform_admin_bypass_organizations on organizations for select
        using (current_setting('app.is_platform_admin', true)::boolean is true)
        """
    )
    op.execute(
        """
        create policy platform_admin_bypass_team_memberships on team_memberships for select
        using (current_setting('app.is_platform_admin', true)::boolean is true)
        """
    )
    op.execute(
        """
        create policy platform_admin_bypass_roles on roles for select
        using (current_setting('app.is_platform_admin', true)::boolean is true)
        """
    )
    op.execute(
        """
        create policy platform_admin_bypass_users on users for select
        using (current_setting('app.is_platform_admin', true)::boolean is true)
        """
    )


def downgrade() -> None:
    op.execute("drop policy if exists platform_admin_bypass_users on users")
    op.execute("drop policy if exists platform_admin_bypass_roles on roles")
    op.execute("drop policy if exists platform_admin_bypass_team_memberships on team_memberships")
    op.execute("drop policy if exists platform_admin_bypass_organizations on organizations")
    op.execute("drop table if exists activity_log cascade")
    op.execute("alter table users drop column if exists is_platform_admin")
