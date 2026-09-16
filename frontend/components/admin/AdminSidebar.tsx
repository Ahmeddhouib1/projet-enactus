"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  CalendarDays,
  Handshake,
  Image as ImageIcon,
  IdCard,
  ClipboardCheck,
  Megaphone,
  Landmark,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "About Content", icon: FileText },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/members", label: "Members", icon: IdCard },
  { href: "/admin/activities", label: "Activities", icon: ClipboardCheck },
  { href: "/admin/project-space", label: "Project Space", icon: FolderKanban },
  { href: "/admin/marketing", label: "Marketing Space", icon: Megaphone },
  { href: "/admin/sponsoring", label: "Sponsoring Space", icon: Landmark },
  { href: "/admin/sg", label: "SG Space", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-enactus-navy text-white lg:flex">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo-enactus-ensi-white.svg"
            alt="Enactus ENSI"
            width={140}
            height={40}
            className="h-9 w-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Admin navigation">
        {ADMIN_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-enactus-yellow text-enactus-navy"
                  : "text-enactus-light-gray hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-6 py-4 text-xs text-enactus-light-gray">
        Enactus ENSI CMS
      </div>
    </aside>
  );
}
