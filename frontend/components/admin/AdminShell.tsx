"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import AdminSidebar, { ADMIN_LINKS } from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { cn } from "@/lib/utils";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F7F7F8]">
      <AdminSidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-[150] flex lg:hidden">
          <div className="absolute inset-0 bg-enactus-navy/60" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-72 flex-col bg-enactus-navy text-white">
            <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
              <span className="text-sm font-bold uppercase tracking-wide text-enactus-yellow">Menu</span>
              <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-6">
              {ADMIN_LINKS.map(({ href, label, icon: Icon, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium",
                      isActive ? "bg-enactus-yellow text-enactus-navy" : "text-enactus-light-gray",
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
