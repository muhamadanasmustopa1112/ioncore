import { Suspense } from "react";
import { Metadata } from "next";
import { Dashboard } from "@/features/dashboard/components";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Dashboard />
    </Suspense>
  );
}
