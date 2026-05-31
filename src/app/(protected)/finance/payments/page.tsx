import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { PaymentListPage } from "@/features/billing/payment/components";

export const metadata: Metadata = {
  title: "Payments",
  description: "Track and confirm customer payments.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <PaymentListPage />
    </Suspense>
  );
}
