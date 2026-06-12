import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { PermissionsPage } from "@/features/administration/permissions/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Permissions",
  description: "Manage RBAC permission catalog for menus, routes, and actions.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <PermissionsPage />
    </Suspense>
  );
}
