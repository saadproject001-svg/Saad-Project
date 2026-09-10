"""Single source of truth for status strings the frontend's StatusBadge component
recognizes (frontend/src/components/StatusBadge.jsx:1-52). StatusBadge falls back to
a generic gray style for any string not in this set, silently — there is no error
surfaced to the user. Any backend code that emits a status value MUST use one of
these constants (never a bare string literal) so a typo or new status is caught by
tests (see tests/integration/test_status_enum_contract.py), not discovered in
production as a gray badge.

If a new business status is genuinely needed, add it here AND get the frontend
updated in the same change — do not add a status the frontend has never seen.
"""

from enum import StrEnum


class KnownStatus(StrEnum):
    OPTIMAL = "Optimal"
    ACTIVE = "Active"
    APPROVED = "Approved"
    PAID = "Paid"
    DELIVERED = "Delivered"
    REFUNDED = "Refunded"
    SHIPPED = "Shipped"
    PACKED = "Packed"
    IN_TRANSIT = "In Transit"
    PROCESSING = "Processing"
    PENDING = "Pending"
    REQUESTED = "Requested"
    PREPARING = "Preparing"
    LOW_STOCK = "Low Stock"
    MONITOR = "Monitor"
    NEAR_FULL = "Near Full"
    WATCH = "Watch"
    OVERSTOCK = "Overstock"
    OUT_OF_STOCK = "Out of Stock"
    FAILED = "Failed"
    CANCELLED = "Cancelled"
    REJECTED = "Rejected"
    ON_HOLD = "On Hold"
    INACTIVE = "Inactive"
    MAINTENANCE = "Maintenance"
    NOT_APPLICABLE = "N/A"
    RESOLVED = "Resolved"
    REIMBURSED = "Reimbursed"
    ENABLED = "Enabled"
    CONNECTED = "Connected"
    SENT = "Sent"
    OPEN = "Open"
    SCHEDULED = "Scheduled"
    INVESTIGATING = "Investigating"
    DENIED = "Denied"
    DISABLED = "Disabled"
    DRAFT = "Draft"
    EFFICIENT = "Efficient"
    WASTEFUL = "Wasteful"
    RECOMMENDED = "Recommended"
    VIP = "VIP"
    REORDER_NOW = "Reorder Now"
    ON_TRACK = "On Track"
    OVERSTOCKED = "Overstocked"
    COMPLIANT = "Compliant"
    VIOLATION = "Violation"
    CRITICAL = "Critical"
    WARNING = "Warning"
    INFO = "Info"
    POSTED = "Posted"


KNOWN_STATUS_VALUES: frozenset[str] = frozenset(s.value for s in KnownStatus)


def assert_known_status(value: str) -> str:
    """Raise if `value` isn't a status the frontend can render meaningfully.
    Call this at the service layer boundary before a status is persisted or returned,
    not scattered through business logic."""
    if value not in KNOWN_STATUS_VALUES:
        raise ValueError(
            f"Status {value!r} is not in the known frontend contract (StatusBadge.jsx). "
            "Add it to app/utils/status_enum.py only after confirming the frontend renders it."
        )
    return value
