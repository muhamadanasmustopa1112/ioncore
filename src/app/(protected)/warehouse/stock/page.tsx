import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { StockListPage } from "@/features/warehouse/components/stock";

export const metadata: Metadata = {
  title: "Stock & Alerts",
  description: "Real-time stock levels across all warehouses with threshold monitoring.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <StockListPage />
    </Suspense>
  );
}
