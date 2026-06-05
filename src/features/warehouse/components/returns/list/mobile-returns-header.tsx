"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeviceReturnRecord } from "@/features/warehouse/types";

interface MobileReturnsHeaderProps {
  items: DeviceReturnRecord[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export function MobileReturnsHeader({
  items,
  selectedStatus,
  onStatusChange,
}: MobileReturnsHeaderProps) {
  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => i.status === "pending_return").length;
    const received = items.filter((i) => i.status === "received").length;
    const restocked = items.filter((i) => i.status === "restocked").length;
    const decommissioned = items.filter(
      (i) => i.status === "decommissioned"
    ).length;

    return { total, pending, received, restocked, decommissioned };
  }, [items]);

  const statuses = useMemo(() => {
    const set = new Set(items.map((i) => i.status));
    return Array.from(set);
  }, [items]);

  const statusLabels: Record<string, string> = {
    pending_return: "Pending",
    received: "Received",
    restocked: "Restocked",
    decommissioned: "Decommissioned",
  };

  return (
    <div className="space-y-3">
      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-2">
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
          <div className="text-[9px] text-muted-foreground">returns</div>
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
            {stats.total > 0
              ? Math.round((stats.pending / stats.total) * 100)
              : 0}
            % of total
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="size-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Received
            </span>
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {stats.received}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.received / stats.total) * 100)
              : 0}
            % of total
          </div>
        </div>
      </div>

      {/* Returns Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-foreground">
              Returns Pipeline
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trash2 className="size-3 text-red-500" />
            <span className="text-[10px] text-muted-foreground">
              {stats.decommissioned} Decommissioned
            </span>
          </div>
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
          {stats.received > 0 && (
            <div
              className="bg-blue-500 transition-all"
              style={{
                width: `${(stats.received / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.restocked > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{
                width: `${(stats.restocked / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.decommissioned > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{
                width: `${(stats.decommissioned / stats.total) * 100}%`,
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">
            Restocked: {stats.restocked}
          </span>
          <span className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.restocked / stats.total) * 100)
              : 0}
            % completed
          </span>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
          <Package className="size-3 mr-1" />
          All
        </Button>
        {statuses.map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "primary" : "outline"}
            size="sm"
            className={cn(
              "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
              selectedStatus === status
                ? ""
                : "border-slate-200 dark:border-slate-700"
            )}
            onClick={() => onStatusChange(status)}
          >
            {statusLabels[status] || status.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
