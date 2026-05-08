import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CreateCustomer } from "@/features/customers/components/create-customer";

export const metadata: Metadata = {
  title: "Create Customer",
  description: "Create a new customer profile.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CreateCustomer />
    </Suspense>
  );
}
