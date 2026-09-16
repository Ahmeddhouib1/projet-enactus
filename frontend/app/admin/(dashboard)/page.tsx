"use client";

import { useEffect, useState } from "react";
import { Briefcase, CalendarDays, CalendarRange, Handshake, ShieldCheck, Users, UserCheck } from "lucide-react";
import DashboardStatCard from "@/components/admin/DashboardStatCard";
import { getDashboardStats } from "@/services/admin/dashboard";
import type { DashboardStats } from "@/types/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading dashboard...</p>;
  }

  if (!stats) {
    return <p className="text-sm text-red-600">Failed to load dashboard statistics.</p>;
  }

  return (
    <div>
      <p className="text-sm text-enactus-dark-gray">
        Overview of the content currently published on the Enactus ENSI website.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Total Projects" value={stats.totalProjects} icon={Briefcase} />
        <DashboardStatCard label="Active Projects" value={stats.activeProjects} icon={ShieldCheck} />
        <DashboardStatCard label="Total Events" value={stats.totalEvents} icon={CalendarDays} />
        <DashboardStatCard label="Event Editions" value={stats.totalEventEditions} icon={CalendarRange} />
        <DashboardStatCard label="Total Partners" value={stats.totalPartners} icon={Handshake} />
        <DashboardStatCard label="Active Partners" value={stats.activePartners} icon={UserCheck} />
        <DashboardStatCard label="Team Members" value={stats.totalTeamMembers} icon={Users} />
      </div>
    </div>
  );
}
