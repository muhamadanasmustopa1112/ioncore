import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchPolicyPage } from "@/features/administration/branch/components/policy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Policies",
  description: "Configure SLA, working hours, and approval rules per branch.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchPolicyPage />
    </Suspense>
  );
}
