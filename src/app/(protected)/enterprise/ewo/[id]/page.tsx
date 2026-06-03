import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EwoDetailPageWrapper } from "@/features/enterprise/ewo/components/detail/ewo-detail-wrapper";

export const metadata: Metadata = {
  title: "EWO Detail",
  description: "View enterprise work order details.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EwoDetailPageWrapper params={params} />
    </Suspense>
  );
}
