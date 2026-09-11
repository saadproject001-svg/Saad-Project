import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { adminListActivity, adminListOrganizations } from "../../lib/endpoints";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";

export default function AdminActivity() {
  const [page, setPage] = useState(1);
  const [organizationId, setOrganizationId] = useState("");
  const { data: orgs } = useApi(adminListOrganizations, []);
  const { data, loading, error, refetch } = useApi(
    () => adminListActivity({ page, pageSize: 25, organizationId: organizationId || undefined }),
    [page, organizationId]
  );

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="p-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neu-text">Platform Activity</h3>
          <p className="text-xs text-neu-muted mt-1">What every user is doing, across every organization</p>
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

      {loading && <LoadingState label="Loading activity..." />}
      {error && <ErrorState error={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] tracking-wider text-neu-muted">
                <tr><th className="text-left px-6 py-4">TIME</th><th className="text-left">ORGANIZATION</th><th className="text-left">ACTOR</th><th className="text-left">EVENT</th><th className="text-left">SUMMARY</th></tr>
              </thead>
              <tbody>
                {data.items.map((a) => (
                  <tr key={a.id} className="hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4 text-neu-muted whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                    <td className="text-neu-text">{a.organization_name ?? "—"}</td>
                    <td className="text-neu-muted">{a.actor_email ?? "—"}</td>
                    <td className="text-neu-text font-mono text-[10px]">{a.event_type}</td>
                    <td className="text-neu-text">{a.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between text-xs text-neu-muted">
            <span>Showing <b className="text-neu-text">{data.items.length}</b> of <b className="text-neu-text">{data.total}</b> events</span>
            <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
