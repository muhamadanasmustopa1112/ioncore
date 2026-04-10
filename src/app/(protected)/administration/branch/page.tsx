import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BranchListPage } from "@/features/administration/branch/components";

export const metadata: Metadata = {
  title: "Branch Management",
  description: "Manage branch hierarchy and configuration.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BranchListPage />
    </Suspense>
  );
}
