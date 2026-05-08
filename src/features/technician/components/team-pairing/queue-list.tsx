"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { paths } from "@/config/paths";
import type { WorkOrderDashboardItem, WorkOrderState, WorkOrderPriority } from "../../types/technician-api";

const STATE_VARIANT: Record<WorkOrderState, "primary" | "warning" | "success" | "destructive" | "info"> = {
  created: "info", unassigned: "warning", assigned: "info", accepted: "info",
  dispatched: "primary", in_progress: "primary", pending_noc_verification: "warning",
  completed: "success", rescheduled: "warning", cancelled: "destructive",
};

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
  const unassigned = items.filter((wo) => {
    const isUnassigned = wo.state === "unassigned" || wo.assigned_team.length === 0;
    if (!isUnassigned) return false;

    if (selectedDate) {
      try {
        const woDate = wo.requested_installation ? format(new Date(wo.requested_installation), "yyyy-MM-dd") : "";
        return woDate === selectedDate;
      } catch {
        return true;
      }
    }
    return true;
  });

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ClipboardList className="size-4 text-primary" />
            Unassigned Queue
            <Badge variant="warning" appearance="light" size="sm">{unassigned.length}</Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[480px] overflow-y-auto">
        {unassigned.length === 0 ? (
          <p className="text-sm text-slate-400 italic p-4">All work orders assigned.</p>
        ) : (
          <div className={`divide-y divide-slate-100 dark:divide-slate-800 ${
            unassigned.length >= 10 ? "max-h-[480px] overflow-y-auto pr-1.5 scrollbar-thin" : ""
          }`}>
            {unassigned.map((wo) => (
              <div key={wo.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={paths.dashboard.technician.detail.getHref(wo.id)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {wo.number}
                    </Link>
                    <Badge variant={STATE_VARIANT[wo.state] ?? "primary"} appearance="light" size="sm" className="uppercase">
                      {humanize(wo.state)}
                    </Badge>
                    {wo.priority && (
                      <Badge variant={PRIORITY_VARIANT[wo.priority] ?? "primary"} appearance="light" size="sm" className="uppercase">
                        {wo.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{wo.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {wo.customer_name} · {wo.site_name} · {fmtDate(wo.requested_installation)}
                  </p>
                  {wo.assignment_sla?.breached_at && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-0.5">SLA BREACHED</p>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAssign(wo)}
                  className="shrink-0 text-[10px] uppercase font-bold"
                >
                  Assign Pairing
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
