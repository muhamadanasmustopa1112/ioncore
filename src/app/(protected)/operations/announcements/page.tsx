import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { AnnouncementListPage } from "@/features/operations/announcements/components";

export const metadata: Metadata = {
  title: "Internal Announcements",
  description: "Broadcast messages to ION Core staff with acknowledgment tracking.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <AnnouncementListPage />
    </Suspense>
  );
}
