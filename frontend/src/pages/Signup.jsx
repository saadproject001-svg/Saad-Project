import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const inputClass = "neu-input w-full h-12 rounded-xl px-4 text-sm text-neu-text bg-transparent outline-none";
const labelClass = "text-xs font-medium text-neu-muted block mb-1.5";

function slugify(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `org-${Date.now().toString(36)}`
  );
}

export default function Signup() {
  const { signUp, isAuthenticated } = useAuth();
  const location = useLocation();
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from ?? "/"} replace />;
  }

  if (needsEmailConfirmation) {
    return (
      <AuthLayout title="Check your email" subtitle="Almost there">
        <p className="text-sm text-neu-text text-center">
          We sent a confirmation link to <span className="font-semibold">{email}</span>. Confirm your
          address, then come back and sign in to finish setting up{" "}
          <span className="font-semibold">{organizationName}</span>.
        </p>
        <Link
          to="/login"
          className="neu-btn-accent w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center mt-6"
        >
          Go to sign in
        </Link>
      </AuthLayout>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await signUp({
        email,
        password,
        organizationName,
        organizationSlug: slugify(organizationName),
      });
      if (result.needsEmailConfirmation) {
        setNeedsEmailConfirmation(true);
      }
      // Otherwise redirect happens declaratively above once the session updates.
    } catch (err) {
      setError(err.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your workspace" subtitle="Set up your organization in a minute">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="signup-org">
            Organization name
          </label>
          <input
            id="signup-org"
            type="text"
            required
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            className={inputClass}
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
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
          <label className={labelClass} htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="signup-confirm-password">
            Confirm password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {submitting ? "Creating your workspace..." : "Create account"}
        </button>
      </form>
      <p className="text-center text-sm text-neu-muted mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-accent font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
