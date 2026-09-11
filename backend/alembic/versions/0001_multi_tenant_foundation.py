"""Multi-tenant foundation: organizations, users, roles/permissions, team
memberships, invitations, workspaces — plus RLS policies enforcing tenant
isolation at the database layer (not just in application code).

Revision ID: 0001
Revises:
Create Date: 2026-09-09

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("create extension if not exists pgcrypto")  # gen_random_uuid()

    # -----------------------------------------------------------------------
    # organizations — the tenant boundary itself. RLS scopes by `id`, not
    # `organization_id`, since it has no parent tenant.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table organizations (
            id          uuid primary key default gen_random_uuid(),
            name        text not null,
            slug        text not null unique,
            created_at  timestamptz not null default now(),
            updated_at  timestamptz not null default now()
        )
        """
    )

    # -----------------------------------------------------------------------
    # users — canonical user record, id mirrors auth.users(id). Replaces the
    # frontend's three disconnected mock sources (currentUser, workspaceUsers,
    # the /account/users table) with one row per person.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table users (
            id            uuid primary key references auth.users(id) on delete cascade,
            email         text not null unique,
            full_name     text,
            avatar_url    text,
            last_login_at timestamptz,
            created_at    timestamptz not null default now(),
            updated_at    timestamptz not null default now()
        )
        """
    )

    # Auto-provision a users row whenever someone signs up via Supabase Auth —
    # this is what makes `users` reliably mirror auth.users without the backend
    # having to do it on first API call.
    #
    # BUG FIXED HERE: `users` has FORCE ROW LEVEL SECURITY (below), and this insert
    # is subject to the `users_self_access` policy's `with check (id =
    # current_setting('app.current_user_id', true)::uuid)`. This trigger fires
    # inside Supabase Auth's OWN signup transaction — a completely different
    # Postgres session than anything our FastAPI backend touches — so
    # app.current_user_id would never be set, current_setting(..., true) would
    # return NULL, `id = NULL` is never true, and the insert would be rejected by
    # RLS, failing every real signup. SECURITY DEFINER does not exempt this from
    # RLS (only BYPASSRLS/superuser do; FORCE ROW LEVEL SECURITY explicitly closes
    # the ordinary owner-bypass). Fix: set app.current_user_id to the new row's own
    # id (transaction-local, via set_config's third arg = true) immediately before
    # the insert, so the check is trivially satisfied by construction.
    op.execute(
        """
        create or replace function handle_new_auth_user() returns trigger as $$
        begin
            perform set_config('app.current_user_id', new.id::text, true);
            insert into public.users (id, email)
            values (new.id, new.email)
            on conflict (id) do nothing;
            return new;
        end;
        $$ language plpgsql security definer set search_path = public
        """
    )
    op.execute(
        """
        create trigger on_auth_user_created
        after insert on auth.users
        for each row execute function handle_new_auth_user()
        """
    )

    # -----------------------------------------------------------------------
    # roles / role_permissions — per-organization, seeded with system defaults
    # by app.services.permission_service on org creation.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table roles (
            id               uuid primary key default gen_random_uuid(),
            organization_id  uuid not null references organizations(id) on delete restrict,
            name             text not null,
            is_system        boolean not null default false,
            created_at       timestamptz not null default now(),
            updated_at       timestamptz not null default now(),
            unique (organization_id, name)
        )
        """
    )
    op.execute(
        """
        create table role_permissions (
            role_id          uuid not null references roles(id) on delete cascade,
            permission_code  text not null,
            primary key (role_id, permission_code)
        )
        """
    )

    # -----------------------------------------------------------------------
    # team_memberships — links users to organizations with a role.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table team_memberships (
            id                   uuid primary key default gen_random_uuid(),
            organization_id      uuid not null references organizations(id) on delete restrict,
            user_id              uuid not null references users(id) on delete cascade,
            role_id              uuid not null references roles(id) on delete restrict,
            status               text not null default 'active',
            invited_by_user_id   uuid references users(id) on delete set null,
            created_at           timestamptz not null default now(),
            updated_at           timestamptz not null default now(),
            unique (organization_id, user_id)
        )
        """
    )

    # -----------------------------------------------------------------------
    # invitations — pending invite by email, before the invitee necessarily
    # has an auth account.
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table invitations (
            id                   uuid primary key default gen_random_uuid(),
            organization_id      uuid not null references organizations(id) on delete restrict,
            email                text not null,
            role_id              uuid not null references roles(id) on delete restrict,
            invited_by_user_id   uuid references users(id) on delete set null,
            token                text not null unique,
            status               text not null default 'pending',
            expires_at           timestamptz not null,
            created_at           timestamptz not null default now(),
            updated_at           timestamptz not null default now()
        )
        """
    )

    # -----------------------------------------------------------------------
    # workspaces — optional subdivision below the tenant boundary (e.g.
    # distinct marketplace storefronts within one org).
    # -----------------------------------------------------------------------
    op.execute(
        """
        create table workspaces (
            id               uuid primary key default gen_random_uuid(),
            organization_id  uuid not null references organizations(id) on delete restrict,
            name             text not null,
            created_at       timestamptz not null default now(),
            updated_at       timestamptz not null default now()
        )
        """
    )

    # -----------------------------------------------------------------------
    # Indexes
    # -----------------------------------------------------------------------
    op.execute("create index idx_roles_org on roles(organization_id)")
    op.execute("create index idx_team_memberships_org on team_memberships(organization_id)")
    op.execute("create index idx_team_memberships_user on team_memberships(user_id)")
    op.execute("create index idx_invitations_org on invitations(organization_id)")
    op.execute("create index idx_invitations_email on invitations(email)")
    op.execute("create index idx_workspaces_org on workspaces(organization_id)")

    # -----------------------------------------------------------------------
    # ROW LEVEL SECURITY — the real enforcement boundary.
    #
    # IMPORTANT: this backend connects to Postgres directly via SQLAlchemy/asyncpg,
    # NOT through Supabase's PostgREST layer — so `auth.uid()` and `to authenticated`
    # do nothing useful here: `auth.uid()` reads a `request.jwt.claims` session
    # setting that only PostgREST populates, and `to authenticated` only restricts
    # policies for sessions running AS the Postgres `authenticated` role, which a
    # direct backend connection is not. Worse, a direct connection typically owns
    # these tables (having run the migrations) and Postgres exempts table owners
    # from RLS by default — so without FORCE ROW LEVEL SECURITY below, RLS would be
    # silently bypassed entirely regardless of policy content.
    #
    # Instead: every policy here keys off two session variables the backend sets
    # itself, from its own already-verified JWT, once per request:
    #   - app.current_user_id — set as soon as the JWT is verified (before org
    #     resolution), via app.dependencies.get_plain_db / get_db.
    #   - app.current_org_id  — set only once org membership has been validated
    #     (app.dependencies.get_current_org), via `SET LOCAL` in get_db.
    # current_setting(..., true) returns NULL rather than raising when unset, so an
    # unauthenticated/context-less session matches nothing rather than erroring —
    # fails closed either way.
    # -----------------------------------------------------------------------
    op.execute("alter table organizations enable row level security")
    op.execute("alter table organizations force row level security")
    op.execute("alter table roles enable row level security")
    op.execute("alter table roles force row level security")
    op.execute("alter table role_permissions enable row level security")
    op.execute("alter table role_permissions force row level security")
    op.execute("alter table team_memberships enable row level security")
    op.execute("alter table team_memberships force row level security")
    op.execute("alter table invitations enable row level security")
    op.execute("alter table invitations force row level security")
    op.execute("alter table workspaces enable row level security")
    op.execute("alter table workspaces force row level security")

    # organizations: members can read/update their own org; anyone with a verified
    # identity can INSERT a new one (that's how orgs get created —
    # app.services.auth_service sets app.current_org_id to the freshly-generated id
    # before this insert so the `with check` below is satisfied even for a brand-new
    # row that has no membership pointing at it yet).
    op.execute(
        """
        create policy org_select on organizations for select
        using (id in (
            select organization_id from team_memberships
            where user_id = current_setting('app.current_user_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy org_insert on organizations for insert
        with check (id = current_setting('app.current_org_id', true)::uuid)
        """
    )
    op.execute(
        """
        create policy org_update on organizations for update
        using (id in (
            select organization_id from team_memberships
            where user_id = current_setting('app.current_user_id', true)::uuid
        ))
        with check (id = current_setting('app.current_org_id', true)::uuid)
        """
    )

    for table in ("roles", "team_memberships", "invitations", "workspaces"):
        op.execute(
            f"""
            create policy tenant_isolation_{table} on {table} for all
            using (organization_id = current_setting('app.current_org_id', true)::uuid)
            with check (organization_id = current_setting('app.current_org_id', true)::uuid)
            """
        )

    # role_permissions has no organization_id of its own — scope transitively
    # through its parent role.
    op.execute(
        """
        create policy tenant_isolation_role_permissions on role_permissions for all
        using (role_id in (
            select id from roles where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        with check (role_id in (
            select id from roles where organization_id = current_setting('app.current_org_id', true)::uuid
        ))
        """
    )

    # Bootstrapping problem: app.dependencies.get_current_org must look up the
    # caller's membership (and then their role's permissions) BEFORE any
    # app.current_org_id exists to set — that's the whole point of the lookup. The
    # tenant_isolation policies above would block it entirely (current_setting
    # returns null on a context-less session, so `organization_id = null` never
    # matches). These three additional *permissive* SELECT-only policies key off
    # app.current_user_id instead (which IS set at this point — see get_plain_db),
    # so a user can always discover their own memberships and resolve their own
    # role's permissions regardless of current_org_id — every write, and every read
    # of anyone else's data, still requires proper tenant context via the policies
    # above (Postgres ORs multiple permissive policies for the same command, so this
    # only adds visibility, never removes isolation).
    op.execute(
        """
        create policy team_memberships_self_select on team_memberships for select
        using (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        create policy roles_member_select on roles for select
        using (organization_id in (
            select organization_id from team_memberships
            where user_id = current_setting('app.current_user_id', true)::uuid
        ))
        """
    )
    op.execute(
        """
        create policy role_permissions_member_select on role_permissions for select
        using (role_id in (
            select id from roles where organization_id in (
                select organization_id from team_memberships
                where user_id = current_setting('app.current_user_id', true)::uuid
            )
        ))
        """
    )

    # users: a person can always read/update their own row; broader visibility
    # (e.g. seeing teammates) is handled at the application layer by joining
    # through team_memberships within an already-tenant-scoped request, not by a
    # blanket RLS grant here.
    op.execute("alter table users enable row level security")
    op.execute("alter table users force row level security")
    op.execute(
        """
        create policy users_self_access on users for all
        using (id = current_setting('app.current_user_id', true)::uuid)
        with check (id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    # Without this, GET /team could only ever resolve the caller's own name/avatar —
    # any other row in the response would 404 out of the ORM lookup, since
    # users_self_access alone hides every teammate's profile. Permissive SELECT-only,
    # so it only widens read visibility to people who share an org, never write access.
    op.execute(
        """
        create policy users_org_member_select on users for select
        using (id in (
            select tm2.user_id from team_memberships tm1
            join team_memberships tm2 on tm2.organization_id = tm1.organization_id
            where tm1.user_id = current_setting('app.current_user_id', true)::uuid
        ))
        """
    )


def downgrade() -> None:
    op.execute("drop table if exists workspaces cascade")
    op.execute("drop table if exists invitations cascade")
    op.execute("drop table if exists team_memberships cascade")
    op.execute("drop table if exists role_permissions cascade")
    op.execute("drop table if exists roles cascade")
    op.execute("drop trigger if exists on_auth_user_created on auth.users")
    op.execute("drop function if exists handle_new_auth_user")
    op.execute("drop table if exists users cascade")
    op.execute("drop table if exists organizations cascade")
