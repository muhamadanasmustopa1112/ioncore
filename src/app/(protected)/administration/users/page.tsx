import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { UserListPage } from "@/features/administration/users/components";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage user accounts and role assignments.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <UserListPage />
    </Suspense>
  );
}
