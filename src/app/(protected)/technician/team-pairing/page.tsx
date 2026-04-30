import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { TeamPairingDashboard } from "@/features/technician/components/team-pairing";

export default function TeamPairingPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TeamPairingDashboard />
    </Suspense>
  );
}
