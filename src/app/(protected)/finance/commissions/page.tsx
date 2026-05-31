import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CommissionListPage } from "@/features/billing/commission/components";

export const metadata: Metadata = {
  title: "Commissions",
  description: "Track sales commissions and payouts.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CommissionListPage />
    </Suspense>
  );
}
