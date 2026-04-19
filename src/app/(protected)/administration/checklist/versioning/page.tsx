export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ChecklistVersioningPage } from "@/features/administration/checklist/components/versioning";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ChecklistVersioningPage />
    </Suspense>
  );
}
