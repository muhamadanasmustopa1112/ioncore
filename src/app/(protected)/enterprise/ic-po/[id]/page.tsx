import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { IcPoDetailPageWrapper } from "@/features/enterprise/ic-po/components/detail/ic-po-detail-wrapper";

export const metadata: Metadata = {
  title: "Intercompany PO Detail",
  description: "View intercompany purchase order details.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <IcPoDetailPageWrapper params={params} />
    </Suspense>
  );
}
