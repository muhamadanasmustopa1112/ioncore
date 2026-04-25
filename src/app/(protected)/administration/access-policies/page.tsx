import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { AccessPoliciesPage } from "@/features/administration/access-policies/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Access Policies",
  description: "Role-permission bindings with allow/deny effect.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <AccessPoliciesPage />
    </Suspense>
  );
}
