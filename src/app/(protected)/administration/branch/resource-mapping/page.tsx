import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchResourceMappingPage } from "@/features/administration/branch/components/resource-mapping";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branch Resource Mapping",
  description: "Assign Sales Reps, Team Leaders, Warehouses, and NOC teams to branch nodes.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchResourceMappingPage />
    </Suspense>
  );
}
