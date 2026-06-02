import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProjectDetailPageWrapper } from "@/features/enterprise/projects/components/detail/project-detail-wrapper";

export const metadata: Metadata = {
  title: "Project Detail",
  description: "View project details and S-Curve progress.",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProjectDetailPageWrapper params={params} />
    </Suspense>
  );
}
