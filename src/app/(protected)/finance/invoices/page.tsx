import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { InvoiceListPage } from "@/features/billing/invoice/components";

export const metadata: Metadata = {
  title: "Invoices",
  description: "Manage customer invoices and billing.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InvoiceListPage />
    </Suspense>
  );
}
