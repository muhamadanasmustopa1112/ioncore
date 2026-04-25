import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { OrdersPage } from "@/features/operations/orders/components";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <OrdersPage />
    </Suspense>
  );
}
