import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerTypesPage } from "@/features/administration/customer-types/components";

export const metadata: Metadata = {
  title: "Customer Types",
  description: "Manage customer types used across products and forms.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CustomerTypesPage />
    </Suspense>
  );
}
