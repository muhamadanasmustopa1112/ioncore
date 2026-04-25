import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CompliancePage } from "@/features/administration/compliance/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compliance",
  description: "Users-access compliance view — who can do what.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <CompliancePage />
    </Suspense>
  );
}
