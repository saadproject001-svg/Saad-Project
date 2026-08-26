const STYLES = {
  FBA: "bg-orange-50 text-orange-600",
  FBM: "bg-blue-50 text-blue-600",
  SFP: "bg-violet-50 text-violet-600",
};

export default function FulfillmentBadge({ type, className = "" }) {
  if (!type) return null;
  const style = STYLES[type] || "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${style} ${className}`}>
      {type}
    </span>
  );
}
