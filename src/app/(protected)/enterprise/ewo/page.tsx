import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EwoListPage } from "@/features/enterprise/ewo/components";

export const metadata: Metadata = {
  title: "EWO",
  description: "Manage enterprise work orders.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EwoListPage />
    </Suspense>
  );
}
