"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";

interface StockItemCategoryFilterProps {
  items: StockItemResponse[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function StockItemCategoryFilter({
  items,
  selectedCategory,
  onCategoryChange,
}: StockItemCategoryFilterProps) {
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category_code).filter(Boolean));
    return Array.from(cats);
  }, [items]);

  if (categories.length === 0) return null;

  return (
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
        <Package className="size-3 mr-1" />
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
          {cat}
        </Button>
      ))}
    </div>
  );
}
