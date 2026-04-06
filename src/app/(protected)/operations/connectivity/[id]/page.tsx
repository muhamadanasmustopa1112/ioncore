import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { CustomerConnectivityDetail } from "@/features/operations/components/customer-connectivity-detail";
export default function CustomerConnectivityPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CustomerConnectivityDetail incidentId={params.id} />
    </Suspense>
  );
}