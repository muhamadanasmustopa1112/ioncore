import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { CustomerConnectivityDetail } from "@/features/operations/components/customer-connectivity-detail";
export default async function CustomerConnectivityPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CustomerConnectivityDetail incidentId={resolvedParams.id} />
    </Suspense>
  );
}