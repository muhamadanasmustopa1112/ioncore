import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { MasterDataPage } from "@/features/administration/master-data/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Master Data",
  description: "Manage network node types, maintenance notice config, and seed data.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <MasterDataPage />
    </Suspense>
  );
}
