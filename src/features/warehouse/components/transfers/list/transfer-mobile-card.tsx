"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Eye,
  MapPin,
  Package,
  Truck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockTransfer } from "@/features/warehouse/types";

const statusVariantMap: Record<
  string,
  "warning" | "secondary" | "info" | "success" | "destructive"
> = {
  pending: "warning",
  in_transit: "info",
  received: "success",
  cancelled: "destructive",
};

const statusBorderMap: Record<string, string> = {
  pending: "border-l-amber-500",
  in_transit: "border-l-blue-500",
  received: "border-l-emerald-500",
  cancelled: "border-l-slate-400",
};

const statusIconBgMap: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-950/40",
  in_transit: "bg-blue-50 dark:bg-blue-950/40",
  received: "bg-emerald-50 dark:bg-emerald-950/40",
  cancelled: "bg-slate-50 dark:bg-slate-800",
};

const statusIconColorMap: Record<string, string> = {
  pending: "text-amber-500",
  in_transit: "text-blue-500",
  received: "text-emerald-500",
  cancelled: "text-slate-500",
};

const statusIcon: Record<string, typeof Package> = {
  pending: Package,
  in_transit: Truck,
  received: Package,
  cancelled: Package,
};

interface TransferMobileCardProps {
  item: StockTransfer;
  onDetail?: (item: StockTransfer) => void;
}

export function TransferMobileCard({
  item,
  onDetail,
}: TransferMobileCardProps) {
  const totalItems = item.items.reduce((sum, i) => sum + i.qty, 0);
  const StatusIcon = statusIcon[item.status] || Package;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        statusBorderMap[item.status] || "border-l-slate-300"
      )}
      onClick={() => onDetail?.(item)}
    >
      {/* Top Section */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              statusIconBgMap[item.status] || "bg-slate-50"
            )}
          >
            <StatusIcon
              className={cn(
                "size-5",
                statusIconColorMap[item.status] || "text-slate-500"
              )}
            />
          </div>

          {/* Transfer ID + Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm font-mono leading-tight truncate">
                {item.id}
              </h3>
              <Badge
                variant={statusVariantMap[item.status] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Route */}
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-muted-foreground truncate text-xs">
                {item.sourceWarehouseName}
              </span>
              <ArrowRight className="size-3 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground truncate text-xs">
                {item.destinationWarehouseName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Stats Grid */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Initiated By */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Initiated By
            </div>
            <div className="flex items-center gap-1">
              <User className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.initiatedByName}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Items Count */}
          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Total Items
            </div>
            <div className="text-sm font-extrabold text-foreground">
              {totalItems}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Date */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <Calendar className="size-3 shrink-0" />
            <span>{formatDate(item.dateInitiated)}</span>
            {item.dateDispatched && (
              <>
                <span className="text-slate-300 dark:text-slate-600">→</span>
                <span>{formatDate(item.dateDispatched)}</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {item.items.length} item{item.items.length > 1 ? "s" : ""}
          </span>
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
