import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { InventoryConfigListPage } from "@/features/warehouse/inventory-config/components";

export const metadata: Metadata = {
  title: "Inventory Config",
  description: "Manage FIFO/LIFO inventory valuation settings per warehouse.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InventoryConfigListPage />
    </Suspense>
  );
}
