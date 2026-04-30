import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { NOCQueueDashboard } from "@/features/technician/components/noc-queue";

export default function NOCQueuePage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <NOCQueueDashboard />
    </Suspense>
  );
}
