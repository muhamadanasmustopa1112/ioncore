import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { CustomerProfile } from "@/features/crm-and-sales/components/customer-profile";
export default function CustomerProfilePage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CustomerProfile />
    </Suspense>
  );
}