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
  { value: "IN_TRANSIT", label: "In Transit", icon: Truck },
  { value: "PENDING", label: "Pending", icon: Clock },
  { value: "PREPARING", label: "Preparing", icon: Wrench },
  { value: "DISPATCHED", label: "Dispatched", icon: Truck },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
];

function normalizeStatus(status: string): string {
  return status.toUpperCase().replace(/-/g, "_");
}

function countByStatus(items: DispatchRecord[], status: string): number {
  return items.filter((i) => normalizeStatus(i.status) === status).length;
}

export function MobileDispatchHeader({
  items,
  selectedStatus,
  onStatusChange,
}: MobileDispatchHeaderProps) {
  const stats = useMemo(() => {
    const total = items.length;
    const inTransit = countByStatus(items, "IN_TRANSIT");
    const pending = countByStatus(items, "PENDING");
    const preparing = countByStatus(items, "PREPARING");
    const dispatched =
      countByStatus(items, "DISPATCHED") + countByStatus(items, "SIGNED_OFF");
    const completed = countByStatus(items, "COMPLETED");

    return { total, inTransit, pending, preparing, dispatched, completed };
  }, [items]);

  return (
    <div className="space-y-3">
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
          <div className="text-[9px] text-muted-foreground">dispatches</div>
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
          <div className="text-[9px] text-muted-foreground">awaiting action</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Truck className="size-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              In Transit
            </span>
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {stats.inTransit + stats.dispatched}
          </div>
          <div className="text-[9px] text-muted-foreground">in the field</div>
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

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-w-0 flex-wrap">
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
        {statusFilters.map(({ value, label }) => (
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
