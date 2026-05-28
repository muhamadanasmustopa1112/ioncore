import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ReportsListPage } from "@/features/warehouse/components/reports";

export const metadata: Metadata = {
  title: "Reports",
  description: "Stock movement history, consumption analysis, and variance reports.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ReportsListPage />
    </Suspense>
  );
}
