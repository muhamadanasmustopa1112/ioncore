"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Calendar,
  Eye,
  FileText,
  MapPin,
  Package,
  PackageCheck,
  RotateCcw,
  Send,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";
import { getMovementTypeVariant } from "@/features/warehouse/types/inventory-movements";

function getMovementStyles(type: string) {
  const upper = type.toUpperCase();
  if (upper.includes("DISPATCH") || (upper.includes("OUT") && !upper.includes("IN"))) {
    return {
      border: "border-l-blue-500",
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-500",
      Icon: Send,
    };
  }
  if (
    upper.includes("RESTOCK") ||
    upper.includes("RECEIVE") ||
    (upper.includes("IN") && !upper.includes("OUT"))
  ) {
    return {
      border: "border-l-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-500",
      Icon: PackageCheck,
    };
  }
  if (upper.includes("TRANSFER") || upper.includes("REFURBISH")) {
    return {
      border: "border-l-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-500",
      Icon: ArrowLeftRight,
    };
  }
  if (upper.includes("ADJUST") || upper.includes("OPNAME")) {
    return {
      border: "border-l-red-500",
      iconBg: "bg-red-50 dark:bg-red-950/40",
      iconColor: "text-red-500",
      Icon: Settings,
    };
  }
  if (upper.includes("RETURN")) {
    return {
      border: "border-l-slate-400",
      iconBg: "bg-slate-50 dark:bg-slate-950/40",
      iconColor: "text-slate-500",
      Icon: RotateCcw,
    };
  }
  return {
    border: "border-l-slate-300",
    iconBg: "bg-slate-50 dark:bg-slate-950/40",
    iconColor: "text-slate-500",
    Icon: Package,
  };
}

interface ReportsMobileCardProps {
  item: InventoryMovementItem;
  onDetail?: (item: InventoryMovementItem) => void;
}

export function ReportsMobileCard({ item, onDetail }: ReportsMobileCardProps) {
  const styles = getMovementStyles(item.movement_type);
  const IconComponent = styles.Icon;

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
        styles.border
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              styles.iconBg
            )}
          >
            <IconComponent className={cn("size-5", styles.iconColor)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.item_name}
              </h3>
              <Badge
                variant={getMovementTypeVariant(item.movement_type)}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.movement_type.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              SKU: {item.sku}
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
              Quantity
            </div>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {item.quantity.toLocaleString()}
              <span className="text-[10px] font-medium text-muted-foreground ml-1">
                {item.unit}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <FileText className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Reference
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-foreground">
              {item.reference_type} #{item.reference_id}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <User className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Actor
              </span>
            </div>
            <span className="text-[11px] font-semibold text-foreground truncate">
              {item.actor}
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
