import { Suspense } from "react";
import { Metadata } from "next";
import { MasterData } from "@/features/master-data/components";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Master Data",
  description: "Manage master data.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <MasterData />
    </Suspense>
  );
}
