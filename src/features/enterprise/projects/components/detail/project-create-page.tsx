"use client";

import { useEffect } from "react";
import { ProjectListPage } from "../index";
import { useProjectStore } from "../../store/project";

export function ProjectCreatePage() {
  const { openFormSheet } = useProjectStore();

  useEffect(() => {
    openFormSheet("new");
  }, [openFormSheet]);

  return <ProjectListPage />;
}
