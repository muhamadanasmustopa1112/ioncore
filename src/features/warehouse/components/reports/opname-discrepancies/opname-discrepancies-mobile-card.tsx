"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardCheck,
  Eye,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OpnameDiscrepancyItem } from "@/features/warehouse/types/opname-discrepancies";
import {
  getSessionStatusVariant,
  getVarianceQtyClass,
} from "@/features/warehouse/types/opname-discrepancies";

interface OpnameDiscrepanciesMobileCardProps {
  item: OpnameDiscrepancyItem;
  onDetail?: (item: OpnameDiscrepancyItem) => void;
}

export function OpnameDiscrepanciesMobileCard({
  item,
  onDetail,
}: OpnameDiscrepanciesMobileCardProps) {
  const isShortage = item.variance_qty < 0;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        isShortage ? "border-l-red-500" : "border-l-emerald-500"
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              isShortage
                ? "bg-red-50 dark:bg-red-950/40"
                : "bg-emerald-50 dark:bg-emerald-950/40"
            )}
          >
            {isShortage ? (
              <Minus className="size-5 text-red-500" />
            ) : (
              <Plus className="size-5 text-emerald-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.item_name}
              </h3>
              <Badge
                variant={getSessionStatusVariant(item.session_status)}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.session_status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              {item.session_number} · #{item.variance_id}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Warehouse
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.warehouse_name}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Variance
            </div>
            <span
              className={cn(
                "text-base font-extrabold tabular-nums",
                getVarianceQtyClass(item.variance_qty)
              )}
            >
              {item.variance_qty > 0 ? "+" : ""}
              {item.variance_qty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <ClipboardCheck className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Resolution
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground capitalize">
              {item.resolution?.replace(/_/g, " ") ?? "—"}
            </span>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1 mb-0.5">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Resolved
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground">
              {item.resolved_at ? formatDate(item.resolved_at) : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-50 dark:border-slate-800/50">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 rounded-none text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
          onClick={(e) => {
            e.stopPropagation();
            onDetail?.(item);
          }}
        >
          <Eye className="size-3.5 mr-1.5" />
          View Details
        </Button>
      </div>
    </div>
  );
}
