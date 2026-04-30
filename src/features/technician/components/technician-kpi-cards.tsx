import { TrendingUp, ClipboardList, Clock, XCircle, Loader2 } from "lucide-react";
import type { WorkOrderDashboardSummary } from "../types/technician-api";

interface Props {
  summary: WorkOrderDashboardSummary | undefined;
  isLoading: boolean;
}

export function TechnicianKpiCards({ summary, isLoading }: Props) {
  const total = summary?.total ?? 0;
  const byState = summary?.by_state ?? ({} as Record<string, number>);

  const inProgress =
    (byState.in_progress ?? 0) +
    (byState.dispatched ?? 0) +
    (byState.accepted ?? 0);

  const pending =
    (byState.created ?? 0) +
    (byState.unassigned ?? 0) +
    (byState.assigned ?? 0);

  const completed =
    (byState.completed ?? 0) + (byState.pending_noc_verification ?? 0);

  const cancelled = byState.cancelled ?? 0;

  const cards = [
    {
      label: "Total Work Orders",
      value: total,
      valueClass: "text-primary",
      icon: ClipboardList,
      sub: `${completed} completed`,
      subClass: "text-slate-400",
    },
    {
      label: "In Progress",
      value: inProgress,
      valueClass: "text-primary",
      icon: TrendingUp,
      sub: "Active on site",
      subClass: "text-emerald-600",
    },
    {
      label: "Pending Assignment",
      value: pending,
      valueClass: pending > 0 ? "text-amber-600" : "text-primary",
      icon: Clock,
      sub: pending > 0 ? "Needs attention" : "All assigned",
      subClass: pending > 0 ? "text-amber-600" : "text-slate-400",
    },
    {
      label: "Cancelled",
      value: cancelled,
      valueClass: cancelled > 0 ? "text-rose-600" : "text-primary",
      icon: XCircle,
      sub: "This period",
      subClass: cancelled > 0 ? "text-rose-600" : "text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      {cards.map(({ label, value, valueClass, icon: Icon, sub, subClass }) => (
        <div
          key={label}
          className="bg-card p-3 sm:p-4 lg:p-5 rounded shadow-sm border border-outline flex flex-col gap-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
              {label}
            </span>
            <Icon className="size-3.5 sm:size-4 text-slate-300 shrink-0" />
          </div>
          {isLoading ? (
            <Loader2 className="size-5 animate-spin text-primary mt-1" />
          ) : (
            <span className={`text-xl sm:text-2xl font-bold ${valueClass}`}>{value}</span>
          )}
          <div className={`text-[9px] sm:text-[10px] font-bold uppercase ${subClass} truncate`}>
            {sub}
          </div>
        </div>
      ))}
    </div>
  );
}
