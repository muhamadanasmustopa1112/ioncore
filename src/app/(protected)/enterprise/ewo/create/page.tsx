import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EwoListPage } from "@/features/enterprise/ewo/components";

export const metadata: Metadata = {
  title: "Create EWO",
  description: "Create a new enterprise work order.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EwoListPage />
    </Suspense>
  );
}
