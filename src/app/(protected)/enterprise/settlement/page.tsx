import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { SettlementListPage } from "@/features/enterprise/settlement/components";

export const metadata: Metadata = {
  title: "Settlement",
  description: "Monthly reseller settlement and revenue sharing.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SettlementListPage />
    </Suspense>
  );
}
