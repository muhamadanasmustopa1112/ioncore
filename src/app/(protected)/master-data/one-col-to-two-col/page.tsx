import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeListPage } from "@/features/one-col-to-two-col/components";
import { ScreenLoader } from "@/components/common/screen-loader";

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
