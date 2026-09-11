export default function Sparkline({ d, className = "stroke-accent", viewBox = "0 0 140 40" }) {
  return (
    <svg viewBox={viewBox} className="w-full mt-3">
      <path
        d={d}
        className={className}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
