"use client";

import { CheckCircle2, Clock, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamLeaderDailySummary, DashboardAlert } from "../../types/technician-api";

function KpiTile({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: number | undefined;
  colorClass: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="size-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value ?? 0}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TeamPairingSummary({
  summary,
  alerts,
}: {
  summary: TeamLeaderDailySummary | undefined;
  alerts: DashboardAlert[] | undefined;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiTile icon={CheckCircle2} label="Completed Today" value={summary?.completed_today} colorClass="bg-emerald-500" />
        <KpiTile icon={Clock} label="Pending Today" value={summary?.pending_today} colorClass="bg-primary" />
        <KpiTile icon={RefreshCw} label="Rescheduled" value={summary?.rescheduled_today} colorClass="bg-amber-500" />
      </div>

      {alerts && alerts.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const colorMap = {
              critical: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/10 dark:border-rose-900/30",
              warning: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/10 dark:border-amber-900/30",
              info: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/10 dark:border-blue-900/30",
            } as const;
            return (
              <div key={alert.id} className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${colorMap[alert.severity]}`}>
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <p>{alert.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
