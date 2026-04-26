import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { SecurityPolicyPage } from "@/features/administration/security-policy/components";

export default function Page() {
  return <Suspense fallback={<ScreenLoader />}><SecurityPolicyPage /></Suspense>;
}
