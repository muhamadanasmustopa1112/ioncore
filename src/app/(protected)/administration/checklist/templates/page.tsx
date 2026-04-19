import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ChecklistTemplatePage } from "@/features/administration/checklist/components/templates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checklist Templates",
  description: "Manage WO execution schemas with step-based checklists.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ChecklistTemplatePage />
    </Suspense>
  );
}
