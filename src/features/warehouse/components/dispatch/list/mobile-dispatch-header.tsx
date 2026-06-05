"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ListFilter,
  Package,
  Truck,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DispatchRecord } from "@/features/warehouse/types";

interface MobileDispatchHeaderProps {
  items: DispatchRecord[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const statusFilters = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "preparing", label: "Preparing", icon: Wrench },
  { value: "dispatched", label: "Dispatched", icon: Truck },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

export function MobileDispatchHeader({
  items,
  selectedStatus,
  onStatusChange,
}: MobileDispatchHeaderProps) {
  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => i.status === "pending").length;
    const preparing = items.filter((i) => i.status === "preparing").length;
    const dispatched = items.filter((i) => i.status === "dispatched").length;
    const completed = items.filter((i) => i.status === "completed").length;

    return { total, pending, preparing, dispatched, completed };
  }, [items]);

  return (
    <div className="space-y-3">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Package className="size-3.5 text-violet-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="text-lg font-extrabold text-foreground">
            {stats.total}
          </div>
          <div className="text-[9px] text-muted-foreground">
            dispatches
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="size-3.5 text-amber-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Pending
            </span>
          </div>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
            {stats.pending}
          </div>
          <div className="text-[9px] text-muted-foreground">
            awaiting action
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Truck className="size-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Dispatched
            </span>
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {stats.dispatched}
          </div>
          <div className="text-[9px] text-muted-foreground">
            in the field
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Completed
            </span>
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0}
            % rate
          </div>
        </div>
      </div>

      {/* Status Pipeline Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-foreground">
            Pipeline
          </span>
          <span className="text-[10px] text-muted-foreground">
            {stats.total} total
          </span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {stats.pending > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{
                width: `${(stats.pending / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.preparing > 0 && (
            <div
              className="bg-slate-400 transition-all"
              style={{
                width: `${(stats.preparing / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.dispatched > 0 && (
            <div
              className="bg-blue-500 transition-all"
              style={{
                width: `${(stats.dispatched / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.completed > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{
                width: `${(stats.completed / stats.total) * 100}%`,
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground shrink-0">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Pending
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground shrink-0">
              <span className="size-1.5 rounded-full bg-slate-400" />
              Preparing
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground shrink-0">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Dispatched
            </span>
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-w-0">
        <Button
          variant={selectedStatus === null ? "primary" : "outline"}
          size="sm"
          className={cn(
            "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
            selectedStatus === null
              ? ""
              : "border-slate-200 dark:border-slate-700"
          )}
          onClick={() => onStatusChange(null)}
        >
          <ListFilter className="size-3 mr-1" />
          All
        </Button>
        {statusFilters.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={selectedStatus === value ? "primary" : "outline"}
            size="sm"
            className={cn(
              "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
              selectedStatus === value
                ? ""
                : "border-slate-200 dark:border-slate-700"
            )}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
