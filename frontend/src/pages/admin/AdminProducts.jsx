import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { adminListProducts, adminListOrganizations } from "../../lib/endpoints";
import StatusBadge from "../../components/StatusBadge";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [organizationId, setOrganizationId] = useState("");
  const { data: orgs } = useApi(adminListOrganizations, []);
  const { data, loading, error, refetch } = useApi(
    () => adminListProducts({ page, pageSize: 25, organizationId: organizationId || undefined }),
    [page, organizationId]
  );

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neu-text">Products Across the Platform</h3>
          <p className="text-xs text-neu-muted mt-1">Catalog visibility across every organization</p>
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

      {loading && <LoadingState label="Loading products..." />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">PRODUCT</th><th className="text-left">SKU</th><th className="text-left">ORGANIZATION</th><th className="text-left">STOCK</th><th className="text-left">UNIT COST</th><th className="text-left">STATUS</th></tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 font-semibold text-neu-text">{p.name}</td>
                    <td className="text-neu-muted">{p.sku}</td>
                    <td className="text-neu-text">{p.organization_name}</td>
                    <td className="text-neu-text">{p.stock}</td>
                    <td className="text-neu-text">${Number(p.unit_cost).toFixed(2)}</td>
                    <td><StatusBadge status={p.status} className="px-2 py-1" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between text-xs text-neu-muted">
            <span>Showing <b className="text-neu-text">{data.items.length}</b> of <b className="text-neu-text">{data.total}</b> products</span>
            <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
