import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { DuplicateReviewPage } from "@/features/administration/duplicate-review/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Duplicate Review & Merge Queue",
  description: "Review flagged duplicate lead pairs and decide to merge, dismiss, or defer.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <DuplicateReviewPage />
    </Suspense>
  );
}
