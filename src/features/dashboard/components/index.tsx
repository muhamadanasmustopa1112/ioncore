"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { paths } from "@/config/paths";
import { ScreenLoader } from "@/components/common/screen-loader";

export function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const isTechnician = user?.roleAssignments.some((r) =>
    r.roleName.toUpperCase().includes("TECHNICIAN")
  );

  useEffect(() => {
    if (isTechnician) {
      toast.error("Access denied. Technician accounts cannot access the dashboard.");
      router.replace(paths.dashboard.technician.root.getHref());
    }
  }, [isTechnician, router]);

  if (isTechnician) return <ScreenLoader />;

  return <div>Dashboard</div>;
}
