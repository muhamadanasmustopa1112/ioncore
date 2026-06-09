"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Bell, CheckCircle2, Gauge } from "lucide-react";
import type { ThresholdDashboardItem } from "@/features/warehouse/types/threshold-dashboard";
import { isStockCritical } from "@/features/warehouse/types/threshold-dashboard";

interface ThresholdDashboardKpiProps {
  items: ThresholdDashboardItem[];
  totalCount: number;
}

export function ThresholdDashboardKpi({
  items,
  totalCount,
}: ThresholdDashboardKpiProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const open = items.filter((i) => i.status.toUpperCase() === "OPEN").length;
    const acknowledged = items.filter(
      (i) => i.status.toUpperCase() === "ACKNOWLEDGED"
    ).length;
    const critical = items.filter(isStockCritical).length;
    return { open, acknowledged, critical };
  }, [items]);

  const cards = [
    {
      label: t("warehouse.totalAlerts", "Total Alerts"),
      value: totalCount.toLocaleString(),
      hint: t("warehouse.thresholdMonitor", "Threshold monitor"),
      icon: Bell,
      iconClass: "text-violet-500",
      valueClass: "text-foreground",
    },
    {
      label: t("warehouse.openAlerts", "Open"),
      value: stats.open.toLocaleString(),
      hint: t("warehouse.inCurrentPage", "In current view"),
      icon: AlertTriangle,
      iconClass: "text-red-500",
      valueClass: "text-red-600 dark:text-red-400",
    },
    {
      label: t("warehouse.acknowledgedAlerts", "Acknowledged"),
      value: stats.acknowledged.toLocaleString(),
      hint: t("warehouse.inCurrentPage", "In current view"),
      icon: CheckCircle2,
      iconClass: "text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: t("warehouse.criticalAlerts", "Critical"),
      value: stats.critical.toLocaleString(),
      hint: t("warehouse.atOrBelowThreshold", "At/below threshold"),
      icon: Gauge,
      iconClass: "text-amber-500",
      valueClass: "text-amber-600 dark:text-amber-400",
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
