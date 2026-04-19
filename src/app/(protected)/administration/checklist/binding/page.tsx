import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ChecklistBindingPage } from "@/features/administration/checklist/components/binding";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checklist Binding Matrix",
  description: "Map WO type × product type to checklist templates.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ChecklistBindingPage />
    </Suspense>
  );
}
