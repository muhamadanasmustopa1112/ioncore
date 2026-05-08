import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomersList } from "@/features/customers/components/customers-list";

export const metadata: Metadata = {
  title: "Customers",
  description: "Customer list and intake",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CustomersList />
    </Suspense>
  );
}
