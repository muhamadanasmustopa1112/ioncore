import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { IncidentDetailPage } from "@/features/war-room/incidents/components";

export const metadata: Metadata = {
  title: "Incident Detail",
  description: "View incident details and timeline.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <IncidentDetailPage />
    </Suspense>
  );
}
