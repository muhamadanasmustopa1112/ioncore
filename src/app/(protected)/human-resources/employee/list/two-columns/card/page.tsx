import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeListTwoColumnsCardPage } from "@/features/hr/employee/components/list-two-columns-card";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeListTwoColumnsCardPage />
    </Suspense>
  );
}
