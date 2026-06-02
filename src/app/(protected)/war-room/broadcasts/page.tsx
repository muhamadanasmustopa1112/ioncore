import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BroadcastHistoryPage } from "@/features/war-room/broadcasts/components";

export const metadata: Metadata = {
  title: "Broadcasts",
  description: "Incident broadcast history.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BroadcastHistoryPage />
    </Suspense>
  );
}
