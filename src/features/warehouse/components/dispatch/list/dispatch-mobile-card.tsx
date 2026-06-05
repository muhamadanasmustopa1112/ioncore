"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Eye,
  MapPin,
  Package,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DispatchRecord } from "@/features/warehouse/types";

const statusVariantMap: Record<
  string,
  "warning" | "secondary" | "info" | "success"
> = {
  pending: "warning",
  preparing: "secondary",
  dispatched: "info",
  completed: "success",
};

const statusBorderMap: Record<string, string> = {
  pending: "border-l-amber-500",
  preparing: "border-l-slate-400",
  dispatched: "border-l-blue-500",
  completed: "border-l-emerald-500",
};

const statusIconBgMap: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-950/40",
  preparing: "bg-slate-50 dark:bg-slate-800",
  dispatched: "bg-blue-50 dark:bg-blue-950/40",
  completed: "bg-emerald-50 dark:bg-emerald-950/40",
};

const statusIconColorMap: Record<string, string> = {
  pending: "text-amber-500",
  preparing: "text-slate-500",
  dispatched: "text-blue-500",
  completed: "text-emerald-500",
};

const statusIcon: Record<string, typeof Package> = {
  pending: Package,
  preparing: Wrench,
  dispatched: Truck,
  completed: Package,
};

interface DispatchMobileCardProps {
  item: DispatchRecord;
  onDetail?: (item: DispatchRecord) => void;
}

export function DispatchMobileCard({
  item,
  onDetail,
}: DispatchMobileCardProps) {
  const totalRequired = item.items.reduce(
    (sum, i) => sum + i.qtyRequired,
    0
  );
  const totalDispatched = item.items.reduce(
    (sum, i) => sum + i.qtyDispatched,
    0
  );
  const progress =
    totalRequired > 0
      ? Math.round((totalDispatched / totalRequired) * 100)
      : 0;

  const serializedCount = item.items.filter(
    (i) => i.itemType === "serialized"
  ).length;
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
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
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

          {/* WO Number + Type */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.woNumber}
              </h3>
              <Badge
                variant={statusVariantMap[item.status] || "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.status}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              {item.woType}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Stats Grid */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Technician */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Technician
            </div>
            <div className="flex items-center gap-1">
              <User className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">
                {item.technicianName}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Warehouse */}
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Warehouse
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {item.warehouseName}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          {/* Dispatched */}
          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Dispatched
            </div>
            <div
              className={cn(
                "text-sm font-extrabold",
                item.status === "completed"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : item.status === "dispatched"
                    ? "text-blue-600 dark:text-blue-400"
                    : item.status === "pending"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-foreground"
              )}
            >
              {totalDispatched}/{totalRequired}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                item.status === "completed"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : item.status === "dispatched"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400"
                    : "bg-gradient-to-r from-amber-500 to-amber-400"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Date + BOM */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <Calendar className="size-3 shrink-0" />
            <span>{formatDate(item.dateCreated)}</span>
            {item.dateDispatched && (
              <>
                <span className="text-slate-300 dark:text-slate-600">→</span>
                <span>{formatDate(item.dateDispatched)}</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {item.items.length} item{item.items.length > 1 ? "s" : ""} •{" "}
            {serializedCount} serialized
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-slate-50 dark:border-slate-800/50">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-10 rounded-none text-[11px] font-bold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
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
