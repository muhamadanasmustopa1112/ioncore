import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ReturnsListPage } from "@/features/warehouse/components/returns";

export const metadata: Metadata = {
  title: "Device Returns",
  description: "Track and manage post-termination device returns.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ReturnsListPage />
    </Suspense>
  );
}
