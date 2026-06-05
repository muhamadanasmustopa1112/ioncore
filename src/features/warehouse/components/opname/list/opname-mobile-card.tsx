"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Eye,
  MapPin,
  Package,
  Play,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockOpname } from "@/features/warehouse/types";

const statusVariantMap: Record<
  string,
  "secondary" | "warning" | "info" | "success" | "destructive"
> = {
  scheduled: "secondary",
  in_progress: "warning",
  completed: "info",
  adjusted: "success",
};

const statusBorderMap: Record<string, string> = {
  scheduled: "border-l-slate-400",
  in_progress: "border-l-amber-500",
  completed: "border-l-blue-500",
  adjusted: "border-l-emerald-500",
};

const statusIconBgMap: Record<string, string> = {
  scheduled: "bg-slate-50 dark:bg-slate-800",
  in_progress: "bg-amber-50 dark:bg-amber-950/40",
  completed: "bg-blue-50 dark:bg-blue-950/40",
  adjusted: "bg-emerald-50 dark:bg-emerald-950/40",
};

const statusIconColorMap: Record<string, string> = {
  scheduled: "text-slate-500",
  in_progress: "text-amber-500",
  completed: "text-blue-500",
  adjusted: "text-emerald-500",
};

const statusIcon: Record<string, typeof Package> = {
  scheduled: ClipboardList,
  in_progress: Play,
  completed: CheckCircle2,
  adjusted: Package,
};

interface OpnameMobileCardProps {
  item: StockOpname;
  onDetail?: (item: StockOpname) => void;
}

export function OpnameMobileCard({
  item,
  onDetail,
}: OpnameMobileCardProps) {
  const StatusIcon = statusIcon[item.status] || Package;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ");
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

          {/* Opname ID + Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm font-mono leading-tight truncate">
                {item.sessionNumber ?? item.id}
              </h3>
              <Badge
                variant={statusVariantMap[item.status] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {formatStatus(item.status)}
              </Badge>
            </div>

            {/* Warehouse */}
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {item.warehouseName}
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
              Items
            </div>
            <div className="text-sm font-extrabold text-foreground">
              {item.items.length}
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Discrepancies */}
          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Discrepancies
            </div>
            <div className="flex items-center justify-end gap-1">
              {item.totalDiscrepancies > 0 && (
                <AlertTriangle className="size-3 text-red-500 shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm font-extrabold",
                  item.totalDiscrepancies > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {item.totalDiscrepancies}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Date */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <Calendar className="size-3 shrink-0" />
            <span>{formatDate(item.scheduledDate)}</span>
            {item.startedAt && (
              <>
                <span className="text-slate-300 dark:text-slate-600">→</span>
                <span>{formatDate(item.startedAt)}</span>
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
