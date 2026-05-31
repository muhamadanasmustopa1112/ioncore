import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { SuspensionListPage } from "@/features/billing/suspension/components";

export const metadata: Metadata = {
  title: "Suspensions",
  description: "Manage service suspensions and restorations.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SuspensionListPage />
    </Suspense>
  );
}
