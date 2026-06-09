"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUp,
  ArrowLeftRight,
  FileBarChart,
  PackageCheck,
  Send,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";

interface MobileReportsHeaderProps {
  items: InventoryMovementItem[];
  totalCount: number;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
}

function bucketMovement(type: string) {
  const upper = type.toUpperCase();
  if (upper.includes("DISPATCH") || (upper.includes("OUT") && !upper.includes("IN"))) {
    return "outbound";
  }
  if (
    upper.includes("RESTOCK") ||
    upper.includes("RECEIVE") ||
    (upper.includes("IN") && !upper.includes("OUT"))
  ) {
    return "inbound";
  }
  if (upper.includes("TRANSFER") || upper.includes("REFURBISH")) return "transfer";
  if (upper.includes("ADJUST") || upper.includes("OPNAME")) return "adjust";
  return "other";
}

export function MobileReportsHeader({
  items,
  totalCount,
  selectedType,
  onTypeChange,
}: MobileReportsHeaderProps) {
  const stats = useMemo(() => {
    const buckets = { outbound: 0, inbound: 0, transfer: 0, adjust: 0, other: 0 };
    let totalQty = 0;

    for (const item of items) {
      buckets[bucketMovement(item.movement_type)] += 1;
      totalQty += item.quantity;
    }

    return { ...buckets, totalQty };
  }, [items]);

  const movementTypes = useMemo(() => {
    const set = new Set(items.map((i) => i.movement_type));
    return Array.from(set).sort();
  }, [items]);

  const pipelineTotal =
    stats.outbound + stats.inbound + stats.transfer + stats.adjust + stats.other || 1;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FileBarChart className="size-3.5 text-violet-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="text-lg font-extrabold text-foreground">{totalCount}</div>
          <div className="text-[9px] text-muted-foreground">movements</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Send className="size-3.5 text-blue-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Outbound
            </span>
          </div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
            {stats.outbound}
          </div>
          <div className="text-[9px] text-muted-foreground">in view</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <PackageCheck className="size-3.5 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Inbound
            </span>
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.inbound}
          </div>
          <div className="text-[9px] text-muted-foreground">in view</div>
        </div>
      </div>

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
              {stats.adjust} Adjusted
            </span>
          </div>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {stats.outbound > 0 && (
            <div
              className="bg-blue-500 transition-all"
              style={{ width: `${(stats.outbound / pipelineTotal) * 100}%` }}
            />
          )}
          {stats.inbound > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${(stats.inbound / pipelineTotal) * 100}%` }}
            />
          )}
          {stats.transfer > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${(stats.transfer / pipelineTotal) * 100}%` }}
            />
          )}
          {stats.adjust > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${(stats.adjust / pipelineTotal) * 100}%` }}
            />
          )}
          {stats.other > 0 && (
            <div
              className="bg-slate-400 transition-all"
              style={{ width: `${(stats.other / pipelineTotal) * 100}%` }}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">
            Qty in view: {stats.totalQty.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground">
            {items.length} loaded
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant={selectedType === null ? "primary" : "outline"}
          size="sm"
          className={cn(
            "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
            selectedType === null ? "" : "border-slate-200 dark:border-slate-700"
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
              selectedType === type ? "" : "border-slate-200 dark:border-slate-700"
            )}
            onClick={() => onTypeChange(type)}
          >
            {type.replace(/_/g, " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
