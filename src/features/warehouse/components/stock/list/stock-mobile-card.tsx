"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";

interface StockMobileCardProps {
  item: StockItemResponse;
  onDetail?: (item: StockItemResponse) => void;
}

export function StockMobileCard({ item, onDetail }: StockMobileCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700",
        "border-l-[3px]",
        item.active ? "border-l-emerald-500" : "border-l-slate-300"
      )}
      onClick={() => onDetail?.(item)}
    >
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              item.active
                ? "bg-emerald-50 dark:bg-emerald-950/40"
                : "bg-slate-50 dark:bg-slate-800"
            )}
          >
            <Package
              className={cn(
                "size-5",
                item.active ? "text-emerald-500" : "text-slate-500"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                {item.name}
              </h3>
              <Badge
                variant={item.active ? "success" : "secondary"}
                appearance="light"
                className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
              >
                {item.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">
              SKU: {item.sku}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Brand / Model
            </div>
            <div className="text-sm font-semibold text-foreground">
              {item.brand} {item.model}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Category
            </div>
            <div className="text-sm font-semibold text-foreground">
              {item.category_code}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Unit
            </div>
            <div className="text-sm font-semibold text-foreground">{item.unit}</div>
          </div>
          <div>
            <div className="text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
              Valuation
            </div>
            <div className="text-sm font-semibold text-muted-foreground">
              {item.valuation_method}
            </div>
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
