import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ResellerCreatePage } from "@/features/enterprise/resellers/components/detail/reseller-create-page";

export const metadata: Metadata = {
  title: "Create Reseller",
  description: "Register a new enterprise reseller.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ResellerCreatePage />
    </Suspense>
  );
}
