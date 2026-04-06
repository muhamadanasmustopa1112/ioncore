import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { TechnicianWorkOrderDetail } from "@/features/technician/components";

export default function TechnicianWorkOrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TechnicianWorkOrderDetail id={params.id} />
    </Suspense>
  );
}
