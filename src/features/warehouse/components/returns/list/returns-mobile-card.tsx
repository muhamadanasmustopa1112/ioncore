"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReturnsListItem } from "@/features/warehouse/types/returns";

const conditionVariantMap: Record<string, "success" | "destructive" | "secondary"> = {
  GOOD: "success",
  DAMAGED: "destructive",
};

const dispositionVariantMap: Record<string, "warning" | "success" | "destructive" | "secondary"> = {
  REFURBISH: "warning",
  RESTOCK: "success",
  DECOMMISSION: "destructive",
};

interface ReturnsMobileCardProps {
  item: ReturnsListItem;
  onDetail?: (item: ReturnsListItem) => void;
}

export function ReturnsMobileCard({ item, onDetail }: ReturnsMobileCardProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg",
        "border-l-[3px] border-l-violet-500"
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm font-mono truncate">
              {item.wo_id}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Asset #{item.asset_id} · WH #{item.received_warehouse_id}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Badge
              variant={conditionVariantMap[item.condition] || "secondary"}
              appearance="light"
              className="text-[9px] uppercase"
            >
              {item.condition}
            </Badge>
            <Badge
              variant={dispositionVariantMap[item.disposition] || "secondary"}
              appearance="light"
              className="text-[9px] uppercase"
            >
              {item.disposition}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {item.actor}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(item.created_at)}
          </span>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] font-semibold gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDetail?.(item);
            }}
          >
            <Eye className="size-3" />
            Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
