import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeDetail } from "@/features/hr/employee/components/detail";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Detail Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeDetail />
    </Suspense>
  );
}
