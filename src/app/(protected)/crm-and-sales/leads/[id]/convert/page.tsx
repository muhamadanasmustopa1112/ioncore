import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ConvertLeadPage } from "@/features/leads/components/convert-lead-page";

export const metadata: Metadata = {
  title: "Convert Lead to Customer",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ConvertLeadPage />
    </Suspense>
  );
}
