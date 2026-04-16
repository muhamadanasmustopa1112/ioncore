import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchCrossBranchRulesPage } from "@/features/administration/branch/components/cross-branch-rules";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cross-branch Operation Rules",
  description: "Define rules governing dispatch, inventory, sales, and NOC operations across branches.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchCrossBranchRulesPage />
    </Suspense>
  );
}
