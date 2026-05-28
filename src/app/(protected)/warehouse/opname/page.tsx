import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { OpnameListPage } from "@/features/warehouse/components/opname";

export const metadata: Metadata = {
  title: "Stock Opname",
  description: "Periodic physical count reconciliation across all warehouses.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <OpnameListPage />
    </Suspense>
  );
}
