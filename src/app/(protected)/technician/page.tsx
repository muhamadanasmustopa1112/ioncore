import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { TechnicianDashboard } from "@/features/technician/components";

export default function TechnicianAndFieldPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TechnicianDashboard />
    </Suspense>
  );
}
