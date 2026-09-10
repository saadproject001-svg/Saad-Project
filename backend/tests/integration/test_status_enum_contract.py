"""Guards against silent drift between app.utils.status_enum.KnownStatus and the
frontend's StatusBadge.jsx. StatusBadge falls back to gray for any unrecognized
string with no error — so if this test ever needs updating, the frontend file
must be checked/updated in the same change, never the other way around alone.

This list is a manually-maintained mirror of frontend/src/components/StatusBadge.jsx's
STYLES object keys (lines 1-52 as of the readiness-report audit). Do not import
directly from the frontend package — Python has no access to the JS module, and a
manual mirror is exactly the tripwire this test exists to provide.
"""

import pytest

from app.utils.status_enum import KNOWN_STATUS_VALUES, KnownStatus, assert_known_status

FRONTEND_STATUS_BADGE_KEYS = frozenset(
    {
        "Optimal", "Active", "Approved", "Paid", "Delivered", "Refunded", "Shipped", "Packed",
        "In Transit", "Processing", "Pending", "Requested", "Preparing", "Low Stock", "Monitor",
        "Near Full", "Watch", "Overstock", "Out of Stock", "Failed", "Cancelled", "Rejected",
        "On Hold", "Inactive", "Maintenance", "N/A", "Resolved", "Reimbursed", "Enabled",
        "Connected", "Sent", "Open", "Scheduled", "Investigating", "Denied", "Disabled", "Draft",
        "Efficient", "Wasteful", "Recommended", "VIP", "Reorder Now", "On Track", "Overstocked",
        "Compliant", "Violation", "Critical", "Warning", "Info", "Posted",
    }
)


def test_backend_enum_matches_frontend_exactly():
    assert KNOWN_STATUS_VALUES == FRONTEND_STATUS_BADGE_KEYS, (
        "app/utils/status_enum.py has drifted from frontend/src/components/StatusBadge.jsx. "
        f"Backend-only: {KNOWN_STATUS_VALUES - FRONTEND_STATUS_BADGE_KEYS}. "
        f"Frontend-only: {FRONTEND_STATUS_BADGE_KEYS - KNOWN_STATUS_VALUES}."
    )


def test_assert_known_status_accepts_every_enum_member():
    for status in KnownStatus:
        assert assert_known_status(status.value) == status.value


def test_assert_known_status_rejects_unknown_string():
    with pytest.raises(ValueError):
        assert_known_status("Definitely Not A Real Status")
