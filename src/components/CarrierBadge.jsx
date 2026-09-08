import { Truck, Package, PlaneTakeoff, Mail, PackageCheck } from "lucide-react";

const CARRIERS = {
  FedEx: { icon: Truck, style: "bg-violet-50 text-violet-600" },
  UPS: { icon: Package, style: "bg-amber-50 text-amber-700" },
  DHL: { icon: PlaneTakeoff, style: "bg-yellow-50 text-yellow-700" },
  USPS: { icon: Mail, style: "bg-blue-50 text-blue-600" },
  "Amazon Logistics": { icon: PackageCheck, style: "bg-orange-50 text-orange-600" },
};

export default function CarrierBadge({ carrier, className = "" }) {
  if (!carrier) return null;
  const { icon: Icon, style } = CARRIERS[carrier] || { icon: Truck, style: "bg-neu-dark/15 text-neu-muted" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${style} ${className}`}>
      <Icon className="w-3 h-3" />
      {carrier}
    </span>
  );
}
