"use client";

import { useEffect, useState } from "react";
import { getCurrentAdmin } from "@/services/admin/auth";
import type { CurrentAdmin } from "@/types/auth";

export function useCurrentAdmin() {
  const [admin, setAdmin] = useState<CurrentAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentAdmin()
      .then((data) => {
        if (!cancelled) setAdmin(data);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { admin, loading };
}
