import { Suspense } from "react";
import { Metadata } from "next";
import { EmployeeUpdate } from "@/features/one-col-new-page/components/update";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Detail Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeUpdate />
    </Suspense>
  );
}
