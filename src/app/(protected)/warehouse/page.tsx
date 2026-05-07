import { Suspense } from "react";
import { Metadata } from "next";
import { WarehouseDashboard } from "@/features/warehouse/components";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Warehouse & Asset Management",
  description: "Monitor and manage warehouses, stock levels, and technical equipment.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <WarehouseDashboard />
    </Suspense>
  );
}
