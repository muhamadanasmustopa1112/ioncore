import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchPerformancePage } from "@/features/administration/branch/components/performance";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Performance & Health",
  description: "Monitor operational KPIs across all Regional, Area, and Sub Area branches.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchPerformancePage />
    </Suspense>
  );
}
