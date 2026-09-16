import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-enactus-light-gray/50 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-enactus-light-gray/20 text-enactus-dark-gray">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-enactus-navy">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-enactus-dark-gray">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
