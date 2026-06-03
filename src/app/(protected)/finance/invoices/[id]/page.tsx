import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { InvoiceDetailPage } from "@/features/billing/invoice/components/detail";

export const metadata: Metadata = {
  title: "Invoice Detail",
  description: "View invoice details and payment history.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InvoiceDetailPage />
    </Suspense>
  );
}
