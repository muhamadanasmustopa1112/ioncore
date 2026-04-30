import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { TechnicianHistoryPage } from "@/features/technician/components/technician-history";

export default function TechnicianHistoryRoute() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TechnicianHistoryPage />
    </Suspense>
  );
}
