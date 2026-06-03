"use client";

import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTable, CardHeader, CardHeading } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_INCIDENTS } from "../data/dummy-incidents";

const severityVariant: Record<string, "destructive" | "warning" | "info"> = { P1: "destructive", P2: "warning", P3: "info" };
const statusVariant: Record<string, "destructive" | "warning" | "info" | "success" | "secondary"> = {
  declared: "warning", active: "destructive", monitoring: "info", closed: "success", pir_complete: "secondary",
};

export function IncidentListPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[{ title: t("menu.warRoom", "War Room"), path: paths.dashboard.warRoom.root.getHref() }, { title: t("warroom.incidents.title", "Active Incidents") }]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warroom.incidents.title", "Active Incidents")}</ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="destructive" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <ShieldAlert className="size-3.5" />{t("warroom.incidents.badge", "Incident Management")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4">
        <Card>
          <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">Active and recent major incidents requiring coordination</p></CardHeading></CardHeader>
          <CardTable>
            <ScrollArea>
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Incident</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Type</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Severity</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Affected</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Downtime</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DUMMY_INCIDENTS.map((inc) => (
                    <tr key={inc.id} className="hover:bg-muted/50 cursor-pointer">
                      <td className="p-4">
                        <div className="font-medium">{inc.incident_name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(inc.declared_at).toLocaleString("id-ID")}</div>
                      </td>
                      <td className="p-4 text-sm capitalize">{inc.incident_type.replace(/_/g, " ")}</td>
                      <td className="p-4"><Badge variant={severityVariant[inc.severity] ?? "info"} appearance="light" className="text-[10px] font-semibold">{inc.severity}</Badge></td>
                      <td className="p-4">{inc.affected_areas.reduce((sum, a) => sum + a.estimated_customers_affected, 0)} customers</td>
                      <td className="p-4">{inc.total_downtime_minutes} min</td>
                      <td className="p-4"><Badge variant={statusVariant[inc.status] ?? "secondary"} appearance="light" className="text-[10px] font-semibold uppercase">{inc.status.replace(/_/g, " ")}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
        </Card>
      </div>
    </div>
  );
}

export function IncidentDetailPage() {
  const { t } = useTranslation();
  const incident = DUMMY_INCIDENTS[0];

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[{ title: t("menu.warRoom", "War Room"), path: paths.dashboard.warRoom.root.getHref() }, { title: incident.incident_name }]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{incident.incident_name}</ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={severityVariant[incident.severity]} appearance="light" className="text-xs font-semibold">{incident.severity}</Badge>
            <Badge variant={statusVariant[incident.status]} appearance="light" className="text-xs font-semibold uppercase">{incident.status.replace(/_/g, " ")}</Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader><CardHeading className="py-3"><p className="text-sm font-semibold">Timeline ({incident.timeline.length} entries)</p></CardHeading></CardHeader>
          <div className="px-6 pb-4 space-y-3">
            {incident.timeline.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">{new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
                <Badge variant="secondary" appearance="light" className="text-[10px] font-semibold shrink-0">{entry.entry_type}</Badge>
                <div className="text-sm"><span className="font-semibold">{entry.created_by}</span> — {entry.message}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardHeading className="py-3"><p className="text-sm font-semibold">Tasks ({incident.tasks.length})</p></CardHeading></CardHeader>
          <div className="px-6 pb-4 space-y-2">
            {incident.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <Badge variant={task.status === "done" ? "success" : task.status === "blocked" ? "destructive" : "info"} appearance="light" className="text-[10px] font-semibold">{task.status}</Badge>
                <span className="text-sm">{task.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">{task.assigned_to_role}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
