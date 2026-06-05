"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  TrendingDown,
  Warehouse,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockLevel } from "@/features/warehouse/types";

interface MobileReceiveHeaderProps {
  items: StockLevel[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function MobileReceiveHeader({
  items,
  selectedCategory,
  onCategoryChange,
}: MobileReceiveHeaderProps) {
  const stats = useMemo(() => {
    const total = items.length;
    const critical = items.filter((i) => i.alertStatus === "Critical").length;
    const warning = items.filter((i) => i.alertStatus === "Warning").length;
    const ok = items.filter((i) => i.alertStatus === "OK").length;
    const totalStock = items.reduce((sum, i) => sum + i.currentStock, 0);
    const warehouses = new Set(items.map((i) => i.warehouseId)).size;

    return { total, critical, warning, ok, totalStock, warehouses };
  }, [items]);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.stockItemCategory));
    return Array.from(cats);
  }, [items]);

  const categoryLabels: Record<string, string> = {
    serialized_device: "Devices",
    cable: "Cables",
    consumable: "Consumables",
    infrastructure: "Infrastructure",
  };

  return (
    <div className="space-y-3">
      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Package className="size-3.5 text-violet-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="text-lg font-extrabold text-foreground">
            {stats.total}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.warehouses} warehouse{stats.warehouses > 1 ? "s" : ""}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <XCircle className="size-3.5 text-red-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Critical
            </span>
          </div>
          <div className="text-lg font-extrabold text-red-600 dark:text-red-400">
            {stats.critical}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.critical / stats.total) * 100)
              : 0}
            % of total
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="size-3.5 text-amber-500" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Warning
            </span>
          </div>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
            {stats.warning}
          </div>
          <div className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.warning / stats.total) * 100)
              : 0}
            % of total
          </div>
        </div>
      </div>

      {/* Stock Health Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-foreground">
              Stock Health
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3 text-emerald-500" />
            <span className="text-[10px] text-muted-foreground">
              {stats.ok} OK
            </span>
          </div>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {stats.critical > 0 && (
            <div
              className="bg-red-500 transition-all"
              style={{
                width: `${(stats.critical / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.warning > 0 && (
            <div
              className="bg-amber-500 transition-all"
              style={{
                width: `${(stats.warning / stats.total) * 100}%`,
              }}
            />
          )}
          {stats.ok > 0 && (
            <div
              className="bg-emerald-500 transition-all"
              style={{
                width: `${(stats.ok / stats.total) * 100}%`,
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground">
            Total: {stats.totalStock.toLocaleString()} units
          </span>
          <span className="text-[9px] text-muted-foreground">
            {stats.total > 0
              ? Math.round((stats.ok / stats.total) * 100)
              : 0}
            % healthy
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Button
          variant={selectedCategory === null ? "primary" : "outline"}
          size="sm"
          className={cn(
            "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
            selectedCategory === null
              ? ""
              : "border-slate-200 dark:border-slate-700"
          )}
          onClick={() => onCategoryChange(null)}
        >
          <Warehouse className="size-3 mr-1" />
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "primary" : "outline"}
            size="sm"
            className={cn(
              "h-7 rounded-full text-[11px] font-semibold px-3 shrink-0",
              selectedCategory === cat
                ? ""
                : "border-slate-200 dark:border-slate-700"
            )}
            onClick={() => onCategoryChange(cat)}
          >
            {categoryLabels[cat] || cat.replace("_", " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
