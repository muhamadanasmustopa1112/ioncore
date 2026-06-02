import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { IncidentListPage } from "@/features/war-room/incidents/components";

export const metadata: Metadata = {
  title: "War Room",
  description: "Active incident management and coordination.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <IncidentListPage />
    </Suspense>
  );
}
