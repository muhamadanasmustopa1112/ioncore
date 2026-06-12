"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/config/permissions";
import { Can } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ClipboardList, MapPin, User, Wrench } from "lucide-react";
import { paths } from "@/config/paths";
import { Progress } from "@/components/ui/progress";
import type { WorkOrderDashboardItem, WorkOrderState, WorkOrderPriority } from "../../types/technician-api";
import { STATE_VARIANT, STATE_I18N_KEY, TYPE_I18N_KEY } from "../technician-detail/shared";

const PRIORITY_VARIANT: Record<WorkOrderPriority, "primary" | "warning" | "destructive" | "info"> = {
  low: "info", medium: "primary", high: "warning", urgent: "destructive",
};

function fmtDate(s: string | undefined | null) {
  if (!s) return "—";
  try { return format(new Date(s), "PP p"); } catch { return s; }
}

function humanize(s: string | undefined | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ");
}

export function QueueList({
  items,
  selectedDate,
  onAssign,
}: {
  items: WorkOrderDashboardItem[];
  selectedDate?: string;
  onAssign: (wo: WorkOrderDashboardItem) => void;
}) {
  const { t } = useTranslation();
  const displayItems = items;

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="size-4 text-primary" />
            {t("workOrder.teamPairing.workOrderQueue")}
            <Badge variant="warning" appearance="light" size="sm">{displayItems.length}</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[480px] overflow-y-auto">
        {displayItems.length === 0 ? (
          <p className="text-sm text-slate-400 italic p-4">{t("workOrder.teamPairing.noWosMatching")}</p>
        ) : (
          <div className={`divide-y divide-slate-100 dark:divide-slate-800 ${displayItems.length >= 10 ? "max-h-[480px] overflow-y-auto pr-1.5 scrollbar-thin" : ""
            }`}>
            {displayItems.map((wo) => {
              const isPendingAssignment = wo.state === "created" || wo.state === "unassigned";

              const isWarning = (() => {
                if (!isPendingAssignment) return false;

                if (wo.assignment_sla?.warning_triggered_at) return true;
                if (!wo.assignment_sla?.due_at || !wo.assignment_sla?.window_minutes) return false;

                const now = new Date().getTime();
                const dueTime = new Date(wo.assignment_sla.due_at).getTime();
                const windowMs = wo.assignment_sla.window_minutes * 60 * 1000;
                const startTime = dueTime - windowMs;

                const elapsedMs = now - startTime;
                const thresholdMs = windowMs * ((wo.assignment_sla.warning_at_percent || 80) / 100);

                return elapsedMs >= thresholdMs && now < dueTime;
              })();

              const isBreached = (() => {
                if (!isPendingAssignment) return false;

                if (wo.assignment_sla?.breached_at) return true;
                if (!wo.assignment_sla?.due_at) return false;

                const now = new Date().getTime();
                const dueTime = new Date(wo.assignment_sla.due_at).getTime();

                return now >= dueTime;
              })();

              return (
                <div key={wo.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <Link
                        href={paths.dashboard.technician.detail.getHref(wo.id)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {wo.number}
                      </Link>
                      <Badge variant={STATE_VARIANT[wo.state] ?? "primary"} appearance="light" size="sm" className="uppercase text-[9px]">
                        {t(STATE_I18N_KEY[wo.state]) || humanize(wo.state)}
                      </Badge>
                      {wo.type && (
                        <span className="text-[9px] font-semibold text-slate-500 uppercase flex items-center gap-1 px-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                          <Wrench className="size-2.5" />
                          {t(TYPE_I18N_KEY[wo.type]) || humanize(wo.type)}
                        </span>
                      )}
                      {wo.priority && (
                        <Badge variant={PRIORITY_VARIANT[wo.priority] ?? "primary"} appearance="light" size="sm" className="uppercase text-[9px]">
                          {(() => {
                            const priorityLower = wo.priority?.toLowerCase();
                            return t(`technician.priority.${priorityLower}`) && !t(`technician.priority.${priorityLower}`).startsWith("technician.priority")
                              ? t(`technician.priority.${priorityLower}`)
                              : wo.priority;
                          })()}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mb-1">
                      {wo.title}
                    </p>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="size-3 text-slate-400 shrink-0" />
                        <span>{wo.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400 shrink-0" />
                        <span>{wo.site_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="size-3 text-slate-400 shrink-0" />
                        <span>{fmtDate(wo.requested_installation)}</span>
                      </div>
                    </div>

                    {(isWarning || isBreached) && (
                      <div className="mt-3 max-w-sm bg-rose-50/30 dark:bg-rose-950/10 p-2 rounded border border-dashed border-rose-200 dark:border-rose-900/30">
                        <div className="flex items-center justify-between text-[9px] font-black mb-1.5 tracking-widest uppercase">
                          <span className="text-slate-500 flex items-center gap-1">
                            <div className={`size-1.5 rounded-full ${isBreached ? "bg-rose-500" : "bg-amber-500 animate-pulse"}`} />
                            {t("workOrder.teamPairing.assignmentProgress", "Assignment Progress")}
                          </span>
                          <span className={isBreached ? "text-rose-600" : "text-amber-600"}>
                            {isBreached ? t("workOrder.detail.breached") : `${wo.assignment_sla?.warning_at_percent}% ${t("workOrder.detail.warning")}`}
                          </span>
                        </div>
                        <Progress
                          value={isBreached ? 100 : (wo.assignment_sla?.warning_at_percent)}
                          indicatorClassName={isBreached ? "bg-rose-500" : "bg-amber-500"}
                          className="h-1.5 bg-slate-200 dark:bg-slate-800"
                        />
                      </div>
                    )}
                  </div>
                  {(wo.state === "unassigned" || wo.state === "created") && (
                    <Can permission={PERMISSIONS.technician.manage}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAssign(wo)}
                        className="shrink-0 text-[10px] uppercase font-bold"
                      >
                        {t("workOrder.detail.assignPairing")}
                      </Button>
                    </Can>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
