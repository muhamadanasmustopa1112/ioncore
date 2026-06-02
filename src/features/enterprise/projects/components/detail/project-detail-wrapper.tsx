"use client";

import { use } from "react";
import { ProjectDetailPage } from "./project-detail";

export function ProjectDetailPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProjectDetailPage projectId={id} />;
}
