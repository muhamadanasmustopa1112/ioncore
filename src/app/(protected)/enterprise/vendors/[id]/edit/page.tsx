import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { VendorEditPage } from "@/features/enterprise/vendors/components/detail/vendor-edit-page";

export const metadata: Metadata = {
  title: "Edit Vendor",
  description: "Edit enterprise vendor.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <VendorEditPage params={params} />
    </Suspense>
  );
}
