import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ReportDashboardPage } from "@/features/billing/report/components";

export const metadata: Metadata = {
  title: "Financial Reports",
  description: "Financial reports and analytics dashboard.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ReportDashboardPage />
    </Suspense>
  );
}
