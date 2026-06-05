"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Eye,
  FileText,
  MapPin,
  Package,
  User,
  Send,
  PackageCheck,
  ArrowLeftRight,
  Minus,
  RotateCcw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockMovementReport } from "@/features/warehouse/types";

const movementTypeVariantMap: Record<
  string,
  "info" | "secondary" | "destructive" | "success" | "warning"
> = {
  dispatch: "info",
  receive: "success",
  transfer_in: "success",
  transfer_out: "warning",
  adjustment: "destructive",
  return: "secondary",
};

const movementBorderMap: Record<string, string> = {
  dispatch: "border-l-blue-500",
  receive: "border-l-emerald-500",
  transfer_in: "border-l-emerald-500",
  transfer_out: "border-l-amber-500",
  adjustment: "border-l-red-500",
  return: "border-l-slate-400",
};

const movementIconBgMap: Record<string, string> = {
  dispatch: "bg-blue-50 dark:bg-blue-950/40",
  receive: "bg-emerald-50 dark:bg-emerald-950/40",
  transfer_in: "bg-emerald-50 dark:bg-emerald-950/40",
  transfer_out: "bg-amber-50 dark:bg-amber-950/40",
  adjustment: "bg-red-50 dark:bg-red-950/40",
  return: "bg-slate-50 dark:bg-slate-950/40",
};

const movementIconColorMap: Record<string, string> = {
  dispatch: "text-blue-500",
  receive: "text-emerald-500",
  transfer_in: "text-emerald-500",
  transfer_out: "text-amber-500",
  adjustment: "text-red-500",
  return: "text-slate-500",
};

const movementIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  dispatch: Send,
  receive: PackageCheck,
  transfer_in: PackageCheck,
  transfer_out: ArrowLeftRight,
  adjustment: Settings,
  return: RotateCcw,
};

const typeLabels: Record<string, string> = {
  dispatch: "Dispatch",
  receive: "Receive",
  transfer_in: "Transfer In",
  transfer_out: "Transfer Out",
  adjustment: "Adjustment",
  return: "Return",
};

interface ReportsMobileCardProps {
  item: StockMovementReport;
  onDetail?: (item: StockMovementReport) => void;
}

export function ReportsMobileCard({ item, onDetail }: ReportsMobileCardProps) {
  const IconComponent = movementIcon[item.movementType] || Package;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        movementBorderMap[item.movementType] || "border-l-slate-300"
      )}
      onClick={() => onDetail?.(item)}
    >
      {/* Top Section */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              movementIconBgMap[item.movementType] || "bg-slate-50"
            )}
          >
            <IconComponent
              className={cn(
                "size-5",
                movementIconColorMap[item.movementType] || "text-slate-500"
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
                variant={movementTypeVariantMap[item.movementType] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {typeLabels[item.movementType] || item.movementType.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              SKU: {item.stockItemSku}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Warehouse + Type + Quantity */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Warehouse */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Warehouse
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.warehouseName}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Quantity */}
          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Quantity
            </div>
            <span
              className={cn(
                "text-base font-extrabold",
                item.quantity > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {item.quantity > 0 ? "+" : ""}
              {item.quantity.toLocaleString()}
              <span className="text-[10px] font-medium text-muted-foreground ml-1">
                {item.uom}
              </span>
            </span>
          </div>
        </div>

        {/* Reference + Performed By + Date Row */}
        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
          {/* Reference */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <FileText className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Reference
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-foreground">
              {item.reference}
            </span>
          </div>

          {/* Performed By */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <User className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                By
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground truncate">
              {item.performedBy}
            </span>
          </div>

          {/* Date */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1 mb-0.5">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Date
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground">
              {formatDate(item.date)}
            </span>
          </div>
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
