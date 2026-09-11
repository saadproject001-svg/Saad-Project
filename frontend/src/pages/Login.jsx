import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const inputClass = "neu-input w-full h-12 rounded-xl px-4 text-sm text-neu-text bg-transparent outline-none";
const labelClass = "text-xs font-medium text-neu-muted block mb-1.5";

export default function Login() {
  const { signIn, isAuthenticated } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? "/"} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn({ email, password });
      // Redirect happens declaratively above once the session updates.
    } catch (err) {
      setError(err.message || "Could not sign in.");
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="neu-btn-accent w-full h-12 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-center text-sm text-neu-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-accent font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
