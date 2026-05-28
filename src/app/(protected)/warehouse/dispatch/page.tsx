import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { DispatchListPage } from "@/features/warehouse/components/dispatch";

export const metadata: Metadata = {
  title: "WO Dispatch",
  description: "Manage work order dispatches from warehouse.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <DispatchListPage />
    </Suspense>
  );
}
