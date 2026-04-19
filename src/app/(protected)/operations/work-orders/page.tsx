export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ScreenLoader } from "@/components/common/screen-loader";
import { WorkOrdersPage } from "@/features/operations/work-orders/components";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <WorkOrdersPage />
    </Suspense>
  );
}
