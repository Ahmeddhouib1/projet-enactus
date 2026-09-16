"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useCurrentAdmin } from "@/lib/hooks/useCurrentAdmin";
import { clearAuthToken } from "@/lib/auth";
import { ADMIN_LINKS } from "@/components/admin/AdminSidebar";

function pageTitle(pathname: string): string {
  const match = [...ADMIN_LINKS].reverse().find((link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href),
  );
  return match?.label ?? "Admin";
}

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useCurrentAdmin();

  function handleLogout() {
    clearAuthToken();
    router.push("/admin/login");
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-enactus-light-gray/30 bg-white px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-md p-2 text-enactus-navy lg:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-enactus-navy">{pageTitle(pathname)}</h1>
      </div>

      <div className="flex items-center gap-4">
        {admin && (
          <span className="hidden text-sm font-medium text-enactus-dark-gray sm:inline">{admin.email}</span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-enactus-light-gray/50 px-4 py-2 text-sm font-semibold text-enactus-navy transition-colors hover:bg-enactus-light-gray/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
