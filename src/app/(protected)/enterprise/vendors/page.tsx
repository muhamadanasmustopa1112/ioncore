import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { VendorListPage } from "@/features/enterprise/vendors/components";

export const metadata: Metadata = {
  title: "Vendors",
  description: "Manage enterprise vendors and suppliers.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <VendorListPage />
    </Suspense>
  );
}
