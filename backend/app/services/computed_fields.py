"""Single source of truth for every derived number the frontend used to receive as
a hand-typed mock literal (margin %, total value, FBA fee totals, stock/capacity
status) — see BACKEND_READINESS_REPORT.md §4/§8, which flagged this exact
inconsistency as the highest-leverage financial-computation risk. Every
service/router that emits one of these values MUST call through here rather than
compute it inline, so a formula only ever needs to change in one place.
"""

from decimal import Decimal

from app.utils.status_enum import KnownStatus

# Placeholder threshold — how far above reorder_point counts as "Overstock" rather
# than "Optimal". Not derivable from the old mock data (BACKEND_READINESS_REPORT.md
# §8 flagged all mock percentages/status as hand-typed, not computed); tune once a
# product owner confirms real inventory-planning targets.
OVERSTOCK_MULTIPLIER = 3


def compute_available(stock: int, reserved: int) -> int:
    return max(stock - reserved, 0)


def compute_total_value(stock: int, unit_cost: Decimal) -> Decimal:
    return Decimal(stock) * unit_cost


def compute_margin_pct(unit_cost: Decimal, selling_price: Decimal) -> float | None:
    if not selling_price:
        return None
    return round(float((selling_price - unit_cost) / selling_price) * 100, 1)


def compute_fba_fee_total(referral: Decimal, fulfillment: Decimal, storage: Decimal, long_term: Decimal) -> Decimal:
    return referral + fulfillment + storage + long_term


def compute_stock_status(stock: int, reserved: int, reorder_point: int) -> KnownStatus:
    available = compute_available(stock, reserved)
    if available <= 0:
        return KnownStatus.OUT_OF_STOCK
    if available <= reorder_point:
        return KnownStatus.LOW_STOCK
    if reorder_point > 0 and available >= reorder_point * OVERSTOCK_MULTIPLIER:
        return KnownStatus.OVERSTOCK
    return KnownStatus.OPTIMAL


def compute_capacity_used_pct(used_units: int, capacity_units: int) -> float | None:
    if not capacity_units:
        return None
    return round(used_units / capacity_units * 100, 1)


def compute_order_total(line_items: list[tuple[int, Decimal]]) -> Decimal:
    """`line_items` is a list of (quantity, unit_price) pairs — used to recompute
    orders.total_amount server-side whenever order_items change, so it can never
    drift from the underlying lines (see app.services.order_service)."""
    total = Decimal("0")
    for quantity, unit_price in line_items:
        total += Decimal(quantity) * unit_price
    return total
