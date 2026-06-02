import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { PirTrackerPage } from "@/features/war-room/pir/components";

export const metadata: Metadata = {
  title: "PIR Tracker",
  description: "Post-Incident Review tracker.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <PirTrackerPage />
    </Suspense>
  );
}
