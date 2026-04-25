import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { LeadIngestionPage } from "@/features/administration/lead-ingestion/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "API Lead Ingestion & Mapping",
  description:
    "Register external lead sources and map their payload fields to internal lead schema.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LeadIngestionPage />
    </Suspense>
  );
}
