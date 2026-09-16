import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-enactus-dark-gray">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-enactus-navy text-enactus-yellow">
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-enactus-navy">{value}</p>
    </div>
  );
}
