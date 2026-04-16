import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchAccessScopePage } from "@/features/administration/branch/components/access-scope";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Access Scope Control",
  description: "Control which users and roles can access specific branches and at what permission level.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchAccessScopePage />
    </Suspense>
  );
}
