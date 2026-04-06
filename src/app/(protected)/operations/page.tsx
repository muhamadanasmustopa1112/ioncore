import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { OperationsDashboard } from "@/features/operations/components";
export default function OperationsPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <OperationsDashboard />
    </Suspense>
  );
}
