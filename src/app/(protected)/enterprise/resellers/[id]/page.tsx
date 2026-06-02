import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ResellerDetailPageWrapper } from "@/features/enterprise/resellers/components/detail/reseller-detail-wrapper";

export const metadata: Metadata = {
  title: "Reseller Detail",
  description: "View reseller details and activity.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ResellerDetailPageWrapper params={params} />
    </Suspense>
  );
}
