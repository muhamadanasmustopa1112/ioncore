import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { SchemaManagementPage } from "@/features/administration/schema/components";

export const metadata: Metadata = {
  title: "Schema Management",
  description: "Manage business schemas for ION Core.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SchemaManagementPage />
    </Suspense>
  );
}
