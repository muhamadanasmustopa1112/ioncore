import { Suspense } from "react";
import { Metadata } from "next";
import { CrmAndSales } from "@/features/crm-and-sales/components";
import { ScreenLoader } from "@/components/common/screen-loader";
export const metadata: Metadata = {
  title: "CRM & Sales",
  description: "Monitor CRM metrics, potential leads, sales deals, and work orders.",
};
export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CrmAndSales />
    </Suspense>
  );
}
