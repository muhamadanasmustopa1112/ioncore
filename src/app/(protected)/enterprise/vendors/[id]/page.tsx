import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { VendorDetailPageWrapper } from "@/features/enterprise/vendors/components/detail/vendor-detail-wrapper";

export const metadata: Metadata = {
  title: "Vendor Detail",
  description: "View vendor details and purchase history.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <VendorDetailPageWrapper params={params} />
    </Suspense>
  );
}
