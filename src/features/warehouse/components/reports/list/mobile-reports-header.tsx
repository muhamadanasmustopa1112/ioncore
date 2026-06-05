"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUp,
  ArrowLeftRight,
  FileBarChart,
  Minus,
  PackageCheck,
  RotateCcw,
  Send,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockMovementReport } from "@/features/warehouse/types";

interface MobileReportsHeaderProps {
  items: StockMovementReport[];
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

export function MobileReportsHeader({
  items,
  selectedType,
  onTypeChange,
}: MobileReportsHeaderProps) {
  const stats = useMemo(() => {
    const total = items.length;
    const dispatched = items.filter((i) => i.movementType === "dispatch").length;
    const received = items.filter(
      (i) => i.movementType === "receive" || i.movementType === "transfer_in"
    ).length;
    const adjusted = items.filter((i) => i.movementType === "adjustment").length;
    const returned = items.filter((i) => i.movementType === "return").length;
    const transferred = items.filter(
      (i) => i.movementType === "transfer_out"
    ).length;
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    return { total, dispatched, received, adjusted, returned, transferred, totalQty };
  }, [items]);

  const movementTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.movementType));
    return Array.from(set);
  }, [items]);

  const typeLabels: Record<string, string> = {
    dispatch: "Dispatch",
    receive: "Receive",
    transfer_in: "Transfer In",
    transfer_out: "Transfer Out",
    adjustment: "Adjustment",
    return: "Return",
  };

  return (
    <div className="space-y-3">
      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FileBarChart className="size-3.5 text-violet-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="text-lg font-extrabold text-foreground">
            {stats.total}
          </div>
          <div className="text-[9px] text-muted-foreground">movements</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Send className="size-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Dispatched
            </span>
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {stats.dispatched}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.dispatched / stats.total) * 100)
              : 0}
            % of total
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <PackageCheck className="size-3.5 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Received
            </span>
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
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

      {/* Movement Pipeline Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ArrowLeftRight className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-foreground">
              Movement Pipeline
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings className="size-3 text-red-500" />
            <span className="text-[10px] text-muted-foreground">
              {stats.adjusted} Adjusted
            </span>
          </div>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {stats.dispatched > 0 && (
            <div
              className="bg-blue-500 transition-all"
              style={{
                width: `${(stats.dispatched / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.received > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{
                width: `${(stats.received / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.transferred > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{
                width: `${(stats.transferred / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.adjusted > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{
                width: `${(stats.adjusted / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.returned > 0 && (
            <div
              className="bg-slate-400 transition-all"
              style={{
                width: `${(stats.returned / stats.total) * 100}%`,
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">
            Net qty: {stats.totalQty > 0 ? "+" : ""}
            {stats.totalQty.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground">
            {stats.total} total movements
          </span>
        </div>
      </div>

      {/* Type Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant={selectedType === null ? "primary" : "outline"}
          size="sm"
          className={cn(
            "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
            selectedType === null
              ? ""
              : "border-slate-200 dark:border-slate-700"
          )}
          onClick={() => onTypeChange(null)}
        >
          <ArrowDownUp className="size-3 mr-1" />
          All
        </Button>
        {movementTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "primary" : "outline"}
            size="sm"
            className={cn(
              "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
              selectedType === type
                ? ""
                : "border-slate-200 dark:border-slate-700"
            )}
            onClick={() => onTypeChange(type)}
          >
            {typeLabels[type] || type.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
