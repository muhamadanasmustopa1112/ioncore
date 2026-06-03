import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProjectEditPage } from "@/features/enterprise/projects/components/detail/project-edit-page";

export const metadata: Metadata = {
  title: "Edit Project",
  description: "Edit enterprise project.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProjectEditPage params={params} />
    </Suspense>
  );
}
