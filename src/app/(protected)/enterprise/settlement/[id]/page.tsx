import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { SettlementDetailPageWrapper } from "@/features/enterprise/settlement/components/detail/settlement-detail-wrapper";

export const metadata: Metadata = {
  title: "Settlement Detail",
  description: "View settlement calculation breakdown and payment status.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettlementDetailPageWrapper params={params} />
    </Suspense>
  );
}
