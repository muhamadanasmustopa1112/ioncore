import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { RoleListPage } from "@/features/administration/roles/components";

export const metadata: Metadata = {
  title: "Role Management",
  description: "Manage role templates and permissions.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <RoleListPage />
    </Suspense>
  );
}
