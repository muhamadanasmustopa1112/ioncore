import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ResellerListPage } from "@/features/enterprise/resellers/components";

export const metadata: Metadata = {
  title: "Resellers",
  description: "Manage enterprise reseller partners.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ResellerListPage />
    </Suspense>
  );
}
