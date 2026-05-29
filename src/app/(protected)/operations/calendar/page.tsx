import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { OperationalCalendarPage } from "@/features/operations/operational-calendar/components";

export const metadata: Metadata = {
  title: "Operational Calendar",
  description: "Centralized view of all scheduled operational events across departments.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <OperationalCalendarPage />
    </Suspense>
  );
}
