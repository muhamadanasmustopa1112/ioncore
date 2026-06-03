"use client";

import { useTranslation } from "react-i18next";
import { Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTable, CardHeader, CardHeading } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { DUMMY_INCIDENTS } from "../../incidents/data/dummy-incidents";

export function BroadcastHistoryPage() {
  const { t } = useTranslation();
  const allBroadcasts = DUMMY_INCIDENTS.flatMap((inc) => inc.broadcasts_sent.map((bc) => ({ ...bc, incident_name: inc.incident_name })));

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb items={[{ title: t("menu.warRoom", "War Room"), path: paths.dashboard.warRoom.root.getHref() }, { title: t("warroom.broadcasts.title", "Broadcasts") }]} />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("warroom.broadcasts.title", "Broadcasts")}</ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <Megaphone className="size-3.5" />{t("warroom.broadcasts.badge", "Broadcast History")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4">
        <Card>
          <CardHeader><CardHeading className="py-4"><p className="text-sm text-muted-foreground">All customer-facing broadcasts sent during incidents</p></CardHeading></CardHeader>
          <CardTable>
            <ScrollArea>
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Incident</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Type</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Message</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Channels</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Recipients</th>
                    <th className="h-12 px-4 text-left font-semibold text-muted-foreground">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allBroadcasts.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No broadcasts yet</td></tr>
                  ) : allBroadcasts.map((bc) => (
                    <tr key={bc.id} className="hover:bg-muted/50">
                      <td className="p-4 font-medium">{bc.incident_name}</td>
                      <td className="p-4"><Badge variant="info" appearance="light" className="text-[10px] font-semibold capitalize">{bc.broadcast_type}</Badge></td>
                      <td className="p-4 max-w-xs truncate text-muted-foreground">{bc.message}</td>
                      <td className="p-4">{bc.channels.map((ch) => <Badge key={ch} variant="secondary" appearance="light" className="text-[10px] mr-1">{ch}</Badge>)}</td>
                      <td className="p-4">{bc.delivered_count}/{bc.recipients_count}</td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(bc.sent_at).toLocaleString("id-ID")}</td>
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
