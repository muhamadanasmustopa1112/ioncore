import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { EmployeeCreate } from "@/features/one-col-new-page/components/create";

export const metadata: Metadata = {
  title: "Detail Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <EmployeeCreate />
    </Suspense>
  );
}
