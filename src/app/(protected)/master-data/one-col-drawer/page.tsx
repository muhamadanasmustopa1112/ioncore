import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeList } from "@/features/one-col-drawer/components/list/employee-list";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Master Data",
  description: "Manage master data.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeList />
    </Suspense>
  );
}
