"use client";

import { useTranslation } from "react-i18next";
import { SquareKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_INCIDENTS } from "../../incidents/data/dummy-incidents";

const columns = [
  { key: "open", label: "Open", variant: "info" as const },
  { key: "in_progress", label: "In Progress", variant: "warning" as const },
  { key: "done", label: "Done", variant: "success" as const },
  { key: "blocked", label: "Blocked", variant: "destructive" as const },
];

export function TaskBoardPage() {
  const { t } = useTranslation();
  const allTasks = DUMMY_INCIDENTS.flatMap((inc) => inc.tasks.map((task) => ({ ...task, incident_name: inc.incident_name })));

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[{ title: t("menu.warRoom", "War Room"), path: paths.dashboard.warRoom.root.getHref() }, { title: t("warroom.tasks.title", "Task Board") }]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warroom.tasks.title", "Task Board")}</ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <SquareKanban className="size-3.5" />{t("warroom.tasks.badge", "Kanban")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const tasks = allTasks.filter((t) => t.status === col.key);
          return (
            <Card key={col.key}>
              <CardHeader><CardHeading className="py-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{col.label}</p><Badge variant={col.variant} appearance="light" className="text-[10px]">{tasks.length}</Badge></div></CardHeading></CardHeader>
              <CardContent className="px-4 pb-4 space-y-2 min-h-[200px]">
                {tasks.map((task) => (
                  <div key={task.id} className="rounded-md border p-3 hover:bg-muted/50">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{task.incident_name}</p>
                    <Badge variant="secondary" appearance="light" className="text-[10px] mt-2">{task.assigned_to_role}</Badge>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">No tasks</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
