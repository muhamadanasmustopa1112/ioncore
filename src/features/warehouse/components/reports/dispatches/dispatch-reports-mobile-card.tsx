"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Eye,
  MapPin,
  Truck,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DispatchReportItem } from "@/features/warehouse/types/dispatch-reports";
import { getWarehouseLabel } from "@/features/warehouse/types/dispatch-reports";

interface DispatchReportsMobileCardProps {
  item: DispatchReportItem;
  onDetail?: (item: DispatchReportItem) => void;
}

export function DispatchReportsMobileCard({
  item,
  onDetail,
}: DispatchReportsMobileCardProps) {
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
        "border-l-[3px] border-l-blue-500"
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-950/40">
            <Truck className="size-5 text-blue-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight font-mono truncate">
                {item.dispatch_number}
              </h3>
              <Badge
                variant="info"
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
              >
                {item.line_count} lines
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              WO: {item.wo_id}
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
                {getWarehouseLabel(item.source_warehouse_id)}
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          <div className="flex-1 text-right">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Total Qty
            </div>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {item.total_quantity.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <User className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Technician
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground truncate">
              {item.technician_user_id}
            </span>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-1 mb-0.5">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Date
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground">
              {formatDate(item.created_at)}
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
