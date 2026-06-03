import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { VendorCreatePage } from "@/features/enterprise/vendors/components/detail/vendor-create-page";

export const metadata: Metadata = {
  title: "Add Vendor",
  description: "Add a new enterprise vendor.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <VendorCreatePage />
    </Suspense>
  );
}
