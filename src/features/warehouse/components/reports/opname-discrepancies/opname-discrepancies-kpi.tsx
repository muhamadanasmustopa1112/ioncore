"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowDownUp,
  CheckCircle2,
  ClipboardList,
  Warehouse,
} from "lucide-react";
import type { OpnameDiscrepancyItem } from "@/features/warehouse/types/opname-discrepancies";

interface OpnameDiscrepanciesKpiProps {
  items: OpnameDiscrepancyItem[];
  totalCount: number;
}

export function OpnameDiscrepanciesKpi({
  items,
  totalCount,
}: OpnameDiscrepanciesKpiProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const resolved = items.filter(
      (i) => i.session_status.toUpperCase() === "RESOLVED"
    ).length;
    const negativeVariance = items.filter((i) => i.variance_qty < 0).length;
    const warehouses = new Set(items.map((i) => i.warehouse_id)).size;
    const totalVariance = items.reduce((sum, i) => sum + i.variance_qty, 0);
    return { resolved, negativeVariance, warehouses, totalVariance };
  }, [items]);

  const cards = [
    {
      label: t("warehouse.totalDiscrepancies", "Total Discrepancies"),
      value: totalCount.toLocaleString(),
      hint: t("warehouse.opnameReview", "Opname review"),
      icon: ClipboardList,
      iconClass: "text-violet-500",
      valueClass: "text-foreground",
    },
    {
      label: t("warehouse.resolved", "Resolved"),
      value: stats.resolved.toLocaleString(),
      hint: t("warehouse.inCurrentPage", "In current view"),
      icon: CheckCircle2,
      iconClass: "text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: t("warehouse.shortages", "Shortages"),
      value: stats.negativeVariance.toLocaleString(),
      hint: t("warehouse.negativeVariance", "Negative variance"),
      icon: ArrowDownUp,
      iconClass: "text-red-500",
      valueClass: "text-red-600 dark:text-red-400",
    },
    {
      label: t("warehouse.netVariance", "Net Variance"),
      value: stats.totalVariance.toLocaleString(),
      hint: `${stats.warehouses} ${t("warehouse.warehousesInvolved", "Warehouses").toLowerCase()}`,
      icon: Warehouse,
      iconClass: "text-amber-500",
      valueClass:
        stats.totalVariance < 0
          ? "text-red-600 dark:text-red-400"
          : "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`size-4 ${card.iconClass}`} />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <div className={`text-2xl font-extrabold ${card.valueClass}`}>
            {card.value}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
