import { useApi } from "../../hooks/useApi";
import { adminListOrganizations } from "../../lib/endpoints";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

export default function AdminOrganizations() {
  const { data: orgs, loading, error, refetch } = useApi(adminListOrganizations, []);

  if (loading) return <LoadingState label="Loading organizations..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-neu-text">All Organizations</h3>
        <p className="text-xs text-neu-muted mt-1">{orgs.length} organizations across the platform</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] tracking-wider text-neu-muted">
            <tr><th className="text-left px-6 py-4">NAME</th><th className="text-left">SLUG</th><th className="text-left">MEMBERS</th><th className="text-left">CREATED</th></tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} className="hover:bg-black/[0.03] transition-colors">
                <td className="px-6 py-4 font-semibold text-neu-text">{o.name}</td>
                <td className="text-neu-muted">{o.slug}</td>
                <td className="text-neu-text">{o.member_count}</td>
                <td className="text-neu-muted">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
