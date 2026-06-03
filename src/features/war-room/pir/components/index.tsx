"use client";

import { useTranslation } from "react-i18next";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTable, CardHeader, CardHeading } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";

const DUMMY_PIRS = [
  { id: "pir-001", incident_id: "inc-002", incident_name: "OLT Down — Sunter", status: "pending" as string, deadline: "2026-06-03T09:30:00Z", completed_by: undefined as string | undefined },
];

export function PirTrackerPage() {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[{ title: t("menu.warRoom", "War Room"), path: paths.dashboard.warRoom.root.getHref() }, { title: t("warroom.pir.title", "PIR Tracker") }]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warroom.pir.title", "PIR Tracker")}</ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="warning" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <ClipboardCheck className="size-3.5" />{t("warroom.pir.badge", "Post-Incident Review")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4">
        <Card>
          <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">Post-Incident Reviews for P1/P2 incidents (must be completed within 48h of closure)</p></CardHeading></CardHeader>
          <CardTable>
            <ScrollArea>
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Incident</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Deadline</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Completed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DUMMY_PIRS.map((pir) => (
                    <tr key={pir.id} className="hover:bg-muted/50 cursor-pointer">
                      <td className="p-4 font-medium">{pir.incident_name}</td>
                      <td className="p-4"><Badge variant={pir.status === "completed" ? "success" : "warning"} appearance="light" className="text-[10px] font-semibold uppercase">{pir.status}</Badge></td>
                      <td className="p-4">{new Date(pir.deadline).toLocaleString("id-ID")}</td>
                      <td className="p-4">{pir.completed_by ?? "—"}</td>
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
