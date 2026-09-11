import ShaderBackground from "./ShaderBackground";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 text-neu-text relative">
      <ShaderBackground />
      <div className="neu-soft w-full max-w-md rounded-2xl p-8 relative z-10">
        <div className="mb-7 text-center">
          <div className="text-xs font-semibold tracking-[0.2em] text-neu-muted uppercase mb-2">
            Inventory Insights Pro
          </div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-neu-muted mt-1.5">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
