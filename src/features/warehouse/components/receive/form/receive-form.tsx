"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";

const receiveSchema = z.object({
  stockItemId: z.string().min(1, "Item is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  receivedBy: z.string().min(2, "Received by is required"),
  notes: z.string().optional(),
});

type ReceiveFormValues = z.infer<typeof receiveSchema>;

export interface ReceiveFormRef {
  submit: () => void;
  isPending: boolean;
}

interface ReceiveFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const STOCK_ITEMS = [
  { id: "SI-001", name: "Huawei HG8145V5 ONT", uom: "pcs" },
  { id: "SI-004", name: "Fiber Optic Cable SM G.657A2", uom: "meters" },
  { id: "SI-006", name: "SC/APC Connector", uom: "pcs" },
  { id: "SI-007", name: "Cable Tie 200mm", uom: "pcs" },
];

const WAREHOUSES = [
  { id: "WH-001", name: "Gudang Jakarta Utara" },
  { id: "WH-002", name: "Gudang Bandung Utara" },
  { id: "WH-003", name: "Gudang Surabaya" },
];

export const ReceiveForm = forwardRef<ReceiveFormRef, ReceiveFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { stockLevels } = useWarehouseStore();

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    } = useForm<ReceiveFormValues>({
      resolver: zodResolver(receiveSchema),
      defaultValues: { stockItemId: "SI-001", warehouseId: "WH-001", quantity: 1, receivedBy: "", notes: "" },
    });

    const selectedItemId = watch("stockItemId");
    const selectedItem = STOCK_ITEMS.find((i) => i.id === selectedItemId);

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: ReceiveFormValues) {
      const warehouse = WAREHOUSES.find((w) => w.id === values.warehouseId);
      const item = STOCK_ITEMS.find((i) => i.id === values.stockItemId);
      if (!warehouse || !item) return;

      const existing = stockLevels.find(
        (sl) => sl.stockItemId === values.stockItemId && sl.warehouseId === values.warehouseId
      );
      if (existing) {
        existing.currentStock += values.quantity;
        existing.alertStatus = existing.currentStock <= existing.threshold * 0.5
          ? "Critical"
          : existing.currentStock <= existing.threshold
          ? "Warning"
          : "OK";
      }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.quantity", "Quantity")} *
            </label>
            <Input
              type="number"
              min={1}
              {...register("quantity", { valueAsNumber: true })}
              readOnly={isReadOnly}
              className="text-xs h-10"
            />
            {errors.quantity && <p className="text-[10px] text-destructive font-bold">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.receivedBy", "Received By")} *
            </label>
            <Input {...register("receivedBy")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.receivedBy && <p className="text-[10px] text-destructive font-bold">{errors.receivedBy.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.notes", "Notes")}
          </label>
          <Input {...register("notes")} readOnly={isReadOnly} className="text-xs h-10" />
        </div>
      </div>
    );
  }
);

ReceiveForm.displayName = "ReceiveForm";
