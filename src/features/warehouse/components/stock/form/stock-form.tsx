"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import type { StockAlertStatus } from "@/features/warehouse/types";

const stockSchema = z.object({
  stockItemId: z.string().min(1, "Item is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  currentStock: z.number().min(0, "Stock must be positive"),
  threshold: z.number().min(1, "Threshold must be at least 1"),
  uom: z.string().min(1, "UoM is required"),
});

type StockFormValues = z.infer<typeof stockSchema>;

export interface StockFormRef {
  submit: () => void;
  isPending: boolean;
}

interface StockFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const STOCK_ITEMS = [
  { id: "SI-001", name: "Huawei HG8145V5 ONT", uom: "pcs" },
  { id: "SI-002", name: "ZTE F609 GPON ONT", uom: "pcs" },
  { id: "SI-003", name: "TP-Link AX3000 Wi-Fi 6 Router", uom: "pcs" },
  { id: "SI-004", name: "Fiber Optic Cable SM G.657A2", uom: "meters" },
  { id: "SI-005", name: "Cat6 UTP Cable", uom: "meters" },
  { id: "SI-006", name: "SC/APC Connector", uom: "pcs" },
  { id: "SI-007", name: "Cable Tie 200mm", uom: "pcs" },
  { id: "SI-008", name: "Splitter 1:8 PLC Box", uom: "pcs" },
];

const WAREHOUSES = [
  { id: "WH-001", name: "Gudang Jakarta Utara" },
  { id: "WH-002", name: "Gudang Bandung Utara" },
  { id: "WH-003", name: "Gudang Surabaya" },
];

export const StockForm = forwardRef<StockFormRef, StockFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { stockLevels, updateThreshold } = useWarehouseStore();

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<StockFormValues>({
      resolver: zodResolver(stockSchema),
      defaultValues: { currentStock: 0, threshold: 10, uom: "pcs", stockItemId: "SI-001", warehouseId: "WH-001" },
    });

    const selectedItemId = watch("stockItemId");
    const selectedItem = STOCK_ITEMS.find((i) => i.id === selectedItemId);

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: StockFormValues) {
      const warehouse = WAREHOUSES.find((w) => w.id === values.warehouseId);
      const item = STOCK_ITEMS.find((i) => i.id === values.stockItemId);
      if (!warehouse || !item) return;

      const alertStatus: StockAlertStatus = values.currentStock <= values.threshold * 0.5
        ? "Critical"
        : values.currentStock <= values.threshold
        ? "Warning"
        : "OK";

      const newLevel = {
        id: `SL-${Date.now()}`,
        stockItemId: values.stockItemId,
        stockItemName: item.name,
        stockItemSku: item.id.replace("SI-", "SKU-"),
        stockItemCategory: "serialized_device" as const,
        stockItemType: "serialized" as const,
        warehouseId: values.warehouseId,
        warehouseName: warehouse.name,
        warehouseBranch: warehouse.name,
        currentStock: values.currentStock,
        threshold: values.threshold,
        uom: values.uom,
        alertStatus,
      };
      stockLevels.push(newLevel);
      onSuccess();
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.itemDetails", "Stock Item")} *
          </label>
          <select
            {...register("stockItemId")}
            disabled={isReadOnly}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {STOCK_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {errors.stockItemId && <p className="text-[10px] text-destructive font-bold">{errors.stockItemId.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.warehouseLabel", "Warehouse")} *
          </label>
          <select
            {...register("warehouseId")}
            disabled={isReadOnly}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            {WAREHOUSES.map((wh) => (
              <option key={wh.id} value={wh.id}>{wh.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.currentStock", "Current Stock")} *
            </label>
            <Input type="number" {...register("currentStock")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.currentStock && <p className="text-[10px] text-destructive font-bold">{errors.currentStock.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.thresholdLabel", "Threshold")} *
            </label>
            <Input type="number" {...register("threshold")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.threshold && <p className="text-[10px] text-destructive font-bold">{errors.threshold.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.uom", "UoM")}
            </label>
            <Input {...register("uom")} readOnly className="text-xs h-10 bg-muted/50" />
          </div>
        </div>
      </div>
    );
  }
);

StockForm.displayName = "StockForm";
