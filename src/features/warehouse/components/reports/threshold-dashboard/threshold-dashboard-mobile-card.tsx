"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  Eye,
  Gauge,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThresholdDashboardItem } from "@/features/warehouse/types/threshold-dashboard";
import {
  getSuggestedActionVariant,
  getThresholdStatusVariant,
  isStockCritical,
} from "@/features/warehouse/types/threshold-dashboard";

interface ThresholdDashboardMobileCardProps {
  item: ThresholdDashboardItem;
  onDetail?: (item: ThresholdDashboardItem) => void;
}

export function ThresholdDashboardMobileCard({
  item,
  onDetail,
}: ThresholdDashboardMobileCardProps) {
  const critical = isStockCritical(item);

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
        critical ? "border-l-red-500" : "border-l-amber-500"
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              critical
                ? "bg-red-50 dark:bg-red-950/40"
                : "bg-amber-50 dark:bg-amber-950/40"
            )}
          >
            <AlertTriangle
              className={cn(
                "size-5",
                critical ? "text-red-500" : "text-amber-500"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.item_name}
              </h3>
              <Badge
                variant={getThresholdStatusVariant(item.status)}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.status}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              {item.sku} · Alert #{item.threshold_alert_id}
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
              Qty / Threshold
            </div>
            <span
              className={cn(
                "text-base font-extrabold tabular-nums",
                critical
                  ? "text-red-600 dark:text-red-400"
                  : "text-foreground"
              )}
            >
              {item.current_qty}
              <span className="text-muted-foreground font-medium">
                {" "}
                / {item.threshold_qty}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50 flex-wrap">
          <Badge
            variant={getSuggestedActionVariant(item.suggested_action)}
            appearance="light"
            className="text-[9px] uppercase"
          >
            {item.suggested_action.replace(/_/g, " ")}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Gauge className="size-3" />
            L{item.cascade_level}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <Calendar className="size-3" />
            {formatDate(item.ack_deadline_at)}
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
