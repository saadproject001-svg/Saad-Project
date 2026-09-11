import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "./LoadingState";

export default function RequireAuth() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState label="Checking your session..." />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
