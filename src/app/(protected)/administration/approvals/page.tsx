import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ApprovalCenterPage } from "@/features/administration/approvals/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Approval Center",
  description: "Review and approve pending schema and product changes.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ApprovalCenterPage />
    </Suspense>
  );
}
