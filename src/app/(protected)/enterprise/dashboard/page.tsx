import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EnterpriseDashboardPage } from "@/features/enterprise/dashboard/components";

export const metadata: Metadata = {
  title: "Enterprise System",
  description: "Enterprise project management, vendor management, and B2B2C operations.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EnterpriseDashboardPage />
    </Suspense>
  );
}
