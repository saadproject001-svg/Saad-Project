import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { adminListUsers } from "../../lib/endpoints";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useApi(() => adminListUsers({ page, pageSize: 25 }), [page]);

  if (loading) return <LoadingState label="Loading users..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-neu-text">All Users</h3>
        <p className="text-xs text-neu-muted mt-1">{data.total} users across the platform</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] tracking-wider text-neu-muted">
            <tr><th className="text-left px-6 py-4">EMAIL</th><th className="text-left">NAME</th><th className="text-left">ORGANIZATIONS</th><th className="text-left">PLATFORM ADMIN</th><th className="text-left">LAST LOGIN</th></tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr key={u.id} className="hover:bg-black/[0.03] transition-colors">
                <td className="px-6 py-4 font-semibold text-neu-text">{u.email}</td>
                <td className="text-neu-text">{u.full_name ?? "—"}</td>
                <td className="text-neu-muted">{u.organizations.join(", ") || "—"}</td>
                <td>{u.is_platform_admin ? <span className="text-accent font-semibold">Yes</span> : <span className="text-neu-muted">No</span>}</td>
                <td className="text-neu-muted">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between text-xs text-neu-muted">
        <span>Showing <b className="text-neu-text">{data.items.length}</b> of <b className="text-neu-text">{data.total}</b> users</span>
        <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
