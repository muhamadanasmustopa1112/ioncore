export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ChecklistOverridesPage } from "@/features/administration/checklist/components/overrides";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ChecklistOverridesPage />
    </Suspense>
  );
}
