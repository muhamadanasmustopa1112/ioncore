import { Suspense } from "react";
import { Metadata } from "next";
import Employee from "@/features/hr/employee/components";
import { ScreenLoader } from "@/components/common/screen-loader";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Employee />
    </Suspense>
  );
}
