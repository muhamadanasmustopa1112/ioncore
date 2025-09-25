import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeListTwoColumnsPage } from "@/features/hr/employee/components/list-two-columns";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeListTwoColumnsPage />
    </Suspense>
  );
}
