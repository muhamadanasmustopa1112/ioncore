"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MobileTableCardProps {
  name: string;
  sku: string;
  category: string;
  stock: number;
  uom: string;
  threshold: number;
  status: "Critical" | "Warning";
  onAction?: () => void;
}

export function MobileTableCard({
  name,
  sku,
  category,
  stock,
  uom,
  threshold,
  status,
  onAction,
}: MobileTableCardProps) {
  const percentage = threshold > 0 ? Math.round((stock / threshold) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
          {name}
        </span>
        <Badge
          variant={status === "Critical" ? "destructive" : "warning"}
          appearance="light"
          className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
        >
          {status}
        </Badge>
      </div>
      <div className="text-[10px] text-slate-400 font-mono mb-2">
        SKU: {sku} • {category}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-white text-xs">
          {stock} {uom}
        </span>
        <span className="text-[9px] text-slate-400">
          min: {threshold} {uom}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full rounded-full ${
            status === "Critical" ? "bg-red-500" : "bg-amber-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {onAction && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 h-8 text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          onClick={onAction}
        >
          <ShoppingCart className="size-3.5 mr-1" />
          Reorder
        </Button>
      )}
    </div>
  );
}
