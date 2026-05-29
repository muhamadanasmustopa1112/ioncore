import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { MaintenanceListPage } from "@/features/operations/planned-maintenance/components";

export const metadata: Metadata = {
  title: "Planned Maintenance",
  description: "Manage scheduled network maintenance windows and track execution.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <MaintenanceListPage />
    </Suspense>
  );
}
