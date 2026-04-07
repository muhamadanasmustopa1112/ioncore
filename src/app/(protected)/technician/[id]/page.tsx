import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { TechnicianWorkOrderDetail } from "@/features/technician/components";

export default async function TechnicianWorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TechnicianWorkOrderDetail id={id} />
    </Suspense>
  );
}
