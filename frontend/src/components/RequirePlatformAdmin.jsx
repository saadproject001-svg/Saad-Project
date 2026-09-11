import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequirePlatformAdmin() {
  const { user } = useAuth();

  if (!user?.is_platform_admin) return <Navigate to="/" replace />;

  return <Outlet />;
}
