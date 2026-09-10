"""Pure-Python checks on the default role/permission bundles — no DB required.
DB-backed verification that seed_default_roles actually persists these correctly
lives in tests/integration/test_tenant_isolation.py (org creation exercises it)."""

from app.core.constants import DEFAULT_ROLE_PERMISSIONS, Permission, SystemRole


def test_every_system_role_has_a_permission_bundle():
    assert set(DEFAULT_ROLE_PERMISSIONS.keys()) == set(SystemRole)


def test_owner_has_every_permission():
    assert set(DEFAULT_ROLE_PERMISSIONS[SystemRole.OWNER]) == set(Permission)


def test_owner_is_the_only_role_with_org_manage():
    for role, permissions in DEFAULT_ROLE_PERMISSIONS.items():
        if role is SystemRole.OWNER:
            continue
        assert Permission.ORG_MANAGE not in permissions, f"{role} should not have ORG_MANAGE"


def test_viewer_has_no_write_permissions():
    write_permissions = {p for p in Permission if p.value.endswith(":write")}
    viewer_permissions = set(DEFAULT_ROLE_PERMISSIONS[SystemRole.VIEWER])
    assert not (viewer_permissions & write_permissions), "Viewer role must be read-only"
