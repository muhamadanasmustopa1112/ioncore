import { Suspense } from "react";
import { ScreenLoader } from "@/components/common/screen-loader";
import { LeadDetail } from "@/features/leads/components/lead-detail";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LeadDetail />
    </Suspense>
  );
}
