import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProjectListPage } from "@/features/enterprise/projects/components";

export const metadata: Metadata = {
  title: "Projects",
  description: "Manage enterprise projects and track progress.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProjectListPage />
    </Suspense>
  );
}
