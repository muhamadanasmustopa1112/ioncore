import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { ApprovalPolicyPage } from "@/features/administration/approval-policy/components";

export default function Page() {
  return <Suspense fallback={<ScreenLoader />}><ApprovalPolicyPage /></Suspense>;
}
