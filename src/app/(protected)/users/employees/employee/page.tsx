import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EmployeeListPage } from "@/features/one-col-drawer/components";

export const metadata: Metadata = {
  title: "Master Data",
  description: "Manage master data.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeListPage />
    </Suspense>
  );
}
