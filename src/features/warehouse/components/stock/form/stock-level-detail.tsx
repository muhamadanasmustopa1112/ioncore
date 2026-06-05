"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { StockLevel } from "@/features/warehouse/types";

const alertVariantMap: Record<string, "destructive" | "warning" | "success"> = {
  Critical: "destructive",
  Warning: "warning",
  OK: "success",
};

interface DetailFieldProps {
  label: string;
  value: ReactNode;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

interface StockLevelDetailProps {
  stock: StockLevel | null;
}

export function StockLevelDetail({ stock }: StockLevelDetailProps) {
  const { t } = useTranslation();

  if (!stock) {
    return (
      <div className="px-1 py-2 text-sm text-muted-foreground">
        {t("warehouse.noStockSelected", "No stock item selected.")}
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 py-2">
      <DetailField
        label={t("warehouse.itemName", "Item Name")}
        value={
          <div>
            <div>{stock.stockItemName}</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              SKU: {stock.stockItemSku}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.category", "Category")}
          value={stock.stockItemCategory.replace(/_/g, " ")}
        />
        <DetailField
          label={t("warehouse.itemType", "Item Type")}
          value={stock.stockItemType}
        />
      </div>

      <DetailField
        label={t("warehouse.warehouseLabel", "Warehouse")}
        value={
          <div>
            <div>{stock.warehouseName}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {stock.warehouseBranch}
            </div>
          </div>
        }
      />

      <DetailField
        label={t("warehouse.alertStatus", "Alert")}
        value={
          <Badge
            variant={alertVariantMap[stock.alertStatus] || "secondary"}
            appearance="light"
            className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
          >
            {stock.alertStatus}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.stockStatus", "Current Stock")}
          value={`${stock.currentStock.toLocaleString()} ${stock.uom}`}
        />
        <DetailField
          label={t("warehouse.thresholdLabel", "Threshold")}
          value={`${stock.threshold.toLocaleString()} ${stock.uom}`}
        />
      </div>
    </div>
  );
}
