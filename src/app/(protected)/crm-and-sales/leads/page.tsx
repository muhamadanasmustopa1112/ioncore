import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { LeadsList } from "@/features/leads/components/leads-list";

export const metadata: Metadata = {
  title: "Leads",
  description: "Sales pipeline — leads list and intake",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LeadsList />
    </Suspense>
  );
}
