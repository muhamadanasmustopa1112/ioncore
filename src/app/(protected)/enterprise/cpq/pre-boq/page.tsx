import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CpqPage } from "@/features/enterprise/cpq/components";

export const metadata: Metadata = {
  title: "Pre-BOQ",
  description: "Manage pre-Bill of Quantities documents.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CpqPage />
    </Suspense>
  );
}
