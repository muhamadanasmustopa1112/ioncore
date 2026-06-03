"use client";

import { use, useEffect } from "react";
import { ProjectListPage } from "../index";
import { useProjectStore } from "../../store/project";
import { useProject } from "../../api/get-project";

export function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: project } = useProject(id);
  const { openFormSheet, setSelectedItem } = useProjectStore();

  useEffect(() => {
    if (project) {
      setSelectedItem(project);
      openFormSheet("edit");
    }
  }, [project, openFormSheet, setSelectedItem]);

  return <ProjectListPage />;
}
