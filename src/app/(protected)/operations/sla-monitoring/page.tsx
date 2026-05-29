import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { SlaDashboardPage } from "@/features/operations/sla-monitoring/components";

export const metadata: Metadata = {
  title: "SLA Monitoring",
  description: "Live operational health view across all departments.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SlaDashboardPage />
    </Suspense>
  );
}
