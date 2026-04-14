import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchCoveragePage } from "@/features/administration/branch/components/coverage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Coverage & Service Area",
  description: "Manage geographic coverage areas per branch.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchCoveragePage />
    </Suspense>
  );
}
