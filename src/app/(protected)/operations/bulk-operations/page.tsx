import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BulkOperationListPage } from "@/features/operations/bulk-operations/components";

export const metadata: Metadata = {
  title: "Bulk Operations",
  description: "Execute mass plan changes, ODP migrations, and bulk work orders.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <BulkOperationListPage />
    </Suspense>
  );
}
