"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { StockItemResponse } from "@/features/warehouse/types/stock-item";

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

interface StockItemDetailProps {
  stockItem: StockItemResponse | null;
}

export function StockItemDetail({ stockItem }: StockItemDetailProps) {
  const { t } = useTranslation();

  if (!stockItem) {
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
            <div>{stockItem.name}</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              SKU: {stockItem.sku}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.category", "Category")}
          value={stockItem.category_code}
        />
        <DetailField
          label={t("warehouse.brandModel", "Brand / Model")}
          value={`${stockItem.brand} ${stockItem.model}`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField label={t("warehouse.unit", "Unit")} value={stockItem.unit} />
        <DetailField
          label={t("warehouse.valuationMethod", "Valuation Method")}
          value={stockItem.valuation_method}
        />
      </div>

      <DetailField
        label={t("warehouse.activeStatus", "Status")}
        value={
          <Badge
            variant={stockItem.active ? "success" : "secondary"}
            appearance="light"
            className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
          >
            {stockItem.active
              ? t("common.active", "Active")
              : t("common.inactive", "Inactive")}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailField
          label={t("warehouse.requiresSerial", "Requires Serial at Intake")}
          value={stockItem.requires_serial_at_intake ? t("common.yes", "Yes") : t("common.no", "No")}
        />
        <DetailField
          label={t("warehouse.subWarehouseAllowed", "Sub-warehouse Allowed")}
          value={stockItem.sub_warehouse_allowed ? t("common.yes", "Yes") : t("common.no", "No")}
        />
      </div>

      <DetailField
        label={t("warehouse.defaultInstallSubtype", "Default Install WO Subtype")}
        value={stockItem.default_install_wo_subtype}
      />

      {stockItem.default_required_skills.length > 0 && (
        <DetailField
          label={t("warehouse.requiredSkills", "Required Skills")}
          value={
            <div className="flex flex-wrap gap-1.5">
              {stockItem.default_required_skills.map((skill) => (
                <Badge key={skill} variant="secondary" appearance="light" className="text-[10px]">
                  {skill}
                </Badge>
              ))}
            </div>
          }
        />
      )}

      <DetailField
        label={t("common.createdAt", "Created At")}
        value={new Date(stockItem.created_at).toLocaleString()}
      />
    </div>
  );
}
