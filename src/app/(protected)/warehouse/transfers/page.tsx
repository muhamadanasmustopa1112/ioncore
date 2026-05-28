import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { TransfersListPage } from "@/features/warehouse/components/transfers";

export const metadata: Metadata = {
  title: "Transfers",
  description: "Manage inter-warehouse stock transfers.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TransfersListPage />
    </Suspense>
  );
}
