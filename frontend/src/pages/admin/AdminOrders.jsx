import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { adminListOrders, adminListOrganizations } from "../../lib/endpoints";
import StatusBadge from "../../components/StatusBadge";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [organizationId, setOrganizationId] = useState("");
  const { data: orgs } = useApi(adminListOrganizations, []);
  const { data, loading, error, refetch } = useApi(
    () => adminListOrders({ page, pageSize: 25, organizationId: organizationId || undefined }),
    [page, organizationId]
  );

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neu-text">Orders Across the Platform</h3>
          <p className="text-xs text-neu-muted mt-1">What customers are buying, across every organization</p>
        </div>
        <select
          value={organizationId}
          onChange={(e) => {
            setOrganizationId(e.target.value);
            setPage(1);
          }}
          className="neu-input h-9 rounded-xl px-3 text-xs text-neu-text"
        >
          <option value="">All organizations</option>
          {orgs?.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </div>

      {loading && <LoadingState label="Loading orders..." />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">ORDER #</th><th className="text-left">ORGANIZATION</th><th className="text-left">TYPE</th><th className="text-left">COUNTERPARTY</th><th className="text-left">TOTAL</th><th className="text-left">STATUS</th><th className="text-left">DATE</th></tr>
              </thead>
              <tbody>
                {data.items.map((o) => (
                  <tr key={o.id} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-accent">{o.order_number}</td>
                    <td className="text-neu-text">{o.organization_name}</td>
                    <td className="text-neu-text">{o.type}</td>
                    <td className="text-neu-muted">{o.counterparty_name ?? "—"}</td>
                    <td className="font-semibold text-neu-text">${Number(o.total_amount).toLocaleString()}</td>
                    <td><StatusBadge status={o.fulfillment_status} className="px-2 py-1" /></td>
                    <td className="text-neu-muted">{o.order_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between text-xs text-neu-muted">
            <span>Showing <b className="text-neu-text">{data.items.length}</b> of <b className="text-neu-text">{data.total}</b> orders</span>
            <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
