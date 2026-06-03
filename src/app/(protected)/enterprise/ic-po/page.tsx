import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { IcPoListPage } from "@/features/enterprise/ic-po/components";

export const metadata: Metadata = {
  title: "Intercompany PO",
  description: "Manage intercompany purchase orders.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <IcPoListPage />
    </Suspense>
  );
}
