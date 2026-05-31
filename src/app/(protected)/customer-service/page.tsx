import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CsDashboard } from "@/features/customer-service/components";

export const metadata: Metadata = {
  title: "Customer Service Dashboard",
  description: "Ticket queue overview and team performance monitoring.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CsDashboard />
    </Suspense>
  );
}
