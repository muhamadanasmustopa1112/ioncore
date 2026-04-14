import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchCapabilityPage } from "@/features/administration/branch/components/capability";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Capability Configuration",
  description: "Configure feature capabilities per branch.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchCapabilityPage />
    </Suspense>
  );
}
