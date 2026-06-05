"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MapPin,
  Package,
  TrendingDown,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockLevel } from "@/features/warehouse/types";

const alertVariantMap: Record<string, "destructive" | "warning" | "success"> =
  {
    Critical: "destructive",
    Warning: "warning",
    OK: "success",
  };

const alertBorderMap: Record<string, string> = {
  Critical: "border-l-red-500",
  Warning: "border-l-amber-500",
  OK: "border-l-emerald-500",
};

const alertIconBgMap: Record<string, string> = {
  Critical: "bg-red-50 dark:bg-red-950/40",
  Warning: "bg-amber-50 dark:bg-amber-950/40",
  OK: "bg-emerald-50 dark:bg-emerald-950/40",
};

const alertIconColorMap: Record<string, string> = {
  Critical: "text-red-500",
  Warning: "text-amber-500",
  OK: "text-emerald-500",
};

interface StockMobileCardProps {
  item: StockLevel;
  onDetail?: (item: StockLevel) => void;
}

export function StockMobileCard({ item, onDetail }: StockMobileCardProps) {
  const percentage =
    item.threshold > 0
      ? Math.round((item.currentStock / item.threshold) * 100)
      : 0;

  const isLow = item.alertStatus !== "OK";

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        alertBorderMap[item.alertStatus] || "border-l-slate-300"
      )}
      onClick={() => onDetail?.(item)}
    >
      {/* Top Section */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Alert Icon */}
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              alertIconBgMap[item.alertStatus] || "bg-slate-50"
            )}
          >
            <Package
              className={cn(
                "size-5",
                alertIconColorMap[item.alertStatus] || "text-slate-500"
              )}
            />
          </div>

          {/* Title + Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.stockItemName}
              </h3>
              <Badge
                variant={alertVariantMap[item.alertStatus] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.alertStatus}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              SKU: {item.stockItemSku}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Stock Stats */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Current Stock */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Stock
            </div>
            <div className="text-base font-extrabold text-foreground">
              {item.currentStock.toLocaleString()}
              <span className="text-[10px] font-medium text-muted-foreground ml-1">
                {item.uom}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Threshold */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Threshold
            </div>
            <div className="text-base font-extrabold text-muted-foreground">
              {item.threshold.toLocaleString()}
              <span className="text-[10px] font-medium ml-1">{item.uom}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Health % */}
          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Health
            </div>
            <div
              className={cn(
                "text-base font-extrabold",
                item.alertStatus === "Critical"
                  ? "text-red-600 dark:text-red-400"
                  : item.alertStatus === "Warning"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {percentage}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                item.alertStatus === "Critical"
                  ? "bg-gradient-to-r from-red-500 to-red-400"
                  : item.alertStatus === "Warning"
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-400"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Location + Action */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Warehouse className="size-3" />
              {item.warehouseName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {item.warehouseBranch}
            </span>
          </div>

          {isLow && (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-red-600 dark:text-red-400">
              <TrendingDown className="size-3" />
              Reorder
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
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
