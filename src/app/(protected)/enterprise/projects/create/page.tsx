import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProjectCreatePage } from "@/features/enterprise/projects/components/detail/project-create-page";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new enterprise project.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProjectCreatePage />
    </Suspense>
  );
}
