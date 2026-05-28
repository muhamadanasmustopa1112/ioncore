import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ReceiveListPage } from "@/features/warehouse/components/receive";

export const metadata: Metadata = {
  title: "Receive Stock",
  description: "Manage incoming stock receipts from procurement, transfers, and returns.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ReceiveListPage />
    </Suspense>
  );
}
