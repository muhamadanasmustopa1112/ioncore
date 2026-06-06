"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftRight,
  Boxes,
  FileBarChart,
  Warehouse,
} from "lucide-react";
import type { InventoryMovementItem } from "@/features/warehouse/types/inventory-movements";

interface InventoryMovementsKpiProps {
  items: InventoryMovementItem[];
  totalCount: number;
}

export function InventoryMovementsKpi({
  items,
  totalCount,
}: InventoryMovementsKpiProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const warehouses = new Set(items.map((i) => i.warehouse_id)).size;
    const movementTypes = new Set(items.map((i) => i.movement_type)).size;
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    return { warehouses, movementTypes, totalQty };
  }, [items]);

  const cards = [
    {
      label: t("warehouse.totalMovements", "Total Movements"),
      value: totalCount.toLocaleString(),
      hint: t("warehouse.auditTrail", "Immutable audit trail"),
      icon: FileBarChart,
      iconClass: "text-violet-500",
      valueClass: "text-foreground",
    },
    {
      label: t("warehouse.warehousesInvolved", "Warehouses"),
      value: stats.warehouses.toLocaleString(),
      hint: t("warehouse.inCurrentPage", "In current view"),
      icon: Warehouse,
      iconClass: "text-blue-500",
      valueClass: "text-blue-600 dark:text-blue-400",
    },
    {
      label: t("warehouse.movementTypes", "Movement Types"),
      value: stats.movementTypes.toLocaleString(),
      hint: t("warehouse.uniqueTypes", "Unique types"),
      icon: ArrowLeftRight,
      iconClass: "text-amber-500",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      label: t("warehouse.totalQuantity", "Total Qty"),
      value: stats.totalQty.toLocaleString(),
      hint: t("warehouse.inCurrentPage", "In current view"),
      icon: Boxes,
      iconClass: "text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
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
