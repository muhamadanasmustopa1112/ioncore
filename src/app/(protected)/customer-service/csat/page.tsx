import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CsatOverviewPage } from "@/features/customer-service/csat/components";

export const metadata: Metadata = {
  title: "CSAT Overview",
  description: "Customer satisfaction scores and trends.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CsatOverviewPage />
    </Suspense>
  );
}
