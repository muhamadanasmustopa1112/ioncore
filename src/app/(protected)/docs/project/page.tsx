import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { Project } from "@/features/project/components";

export const metadata: Metadata = {
  title: "Project",
  description: "Manage Project",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Project />
    </Suspense>
  );
}
