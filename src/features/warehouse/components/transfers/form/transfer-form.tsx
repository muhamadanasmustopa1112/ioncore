"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";

const transferSchema = z.object({
  sourceWarehouseId: z.string().min(1, "Source warehouse is required"),
  destinationWarehouseId: z.string().min(1, "Destination warehouse is required"),
  stockItemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
}).refine((data) => data.sourceWarehouseId !== data.destinationWarehouseId, {
  message: "Source and destination must be different",
  path: ["destinationWarehouseId"],
});

type TransferFormValues = z.infer<typeof transferSchema>;

export interface TransferFormRef {
  submit: () => void;
  isPending: boolean;
}

interface TransferFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

const STOCK_ITEMS = [
  { id: "SI-001", name: "Huawei HG8145V5 ONT", uom: "pcs" },
  { id: "SI-004", name: "Fiber Optic Cable SM G.657A2", uom: "meters" },
  { id: "SI-006", name: "SC/APC Connector", uom: "pcs" },
];

const WAREHOUSES = [
  { id: "WH-001", name: "Gudang Jakarta Utara" },
  { id: "WH-002", name: "Gudang Bandung Utara" },
  { id: "WH-003", name: "Gudang Surabaya" },
];

export const TransferForm = forwardRef<TransferFormRef, TransferFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { transfers } = useWarehouseStore();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<TransferFormValues>({
      resolver: zodResolver(transferSchema),
      defaultValues: { sourceWarehouseId: "WH-001", destinationWarehouseId: "WH-002", stockItemId: "SI-001", quantity: 10, notes: "" },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isSubmitting,
    }));

    function onSubmit(values: TransferFormValues) {
      const source = WAREHOUSES.find((w) => w.id === values.sourceWarehouseId);
      const dest = WAREHOUSES.find((w) => w.id === values.destinationWarehouseId);
      const item = STOCK_ITEMS.find((i) => i.id === values.stockItemId);
      if (!source || !dest || !item) return;

      transfers.push({
        id: `TRF-${Date.now()}`,
        sourceWarehouseId: values.sourceWarehouseId,
        sourceWarehouseName: source.name,
        destinationWarehouseId: values.destinationWarehouseId,
        destinationWarehouseName: dest.name,
        status: "pending",
        initiatedBy: "USR-001",
        initiatedByName: "Admin",
        dateInitiated: new Date().toISOString(),
        items: [{ id: `TRI-${Date.now()}`, stockItemId: item.id, stockItemName: item.name, stockItemSku: item.id, itemType: "serialized", qty: values.quantity, uom: item.uom }],
        notes: values.notes,
      });
      onSuccess();
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.sourceWarehouse", "Source Warehouse")} *
            </label>
            <select
              {...register("sourceWarehouseId")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {WAREHOUSES.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
            </select>
            {errors.sourceWarehouseId && <p className="text-[10px] text-destructive font-bold">{errors.sourceWarehouseId.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.destinationWarehouse", "Destination Warehouse")} *
            </label>
            <select
              {...register("destinationWarehouseId")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {WAREHOUSES.map((wh) => <option key={wh.id} value={wh.id}>{wh.name}</option>)}
            </select>
            {errors.destinationWarehouseId && <p className="text-[10px] text-destructive font-bold">{errors.destinationWarehouseId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.itemDetails", "Item")} *
            </label>
            <select
              {...register("stockItemId")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              {STOCK_ITEMS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.quantity", "Quantity")} *
            </label>
            <Input type="number" {...register("quantity")} readOnly={isReadOnly} className="text-xs h-10" />
            {errors.quantity && <p className="text-[10px] text-destructive font-bold">{errors.quantity.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {t("warehouse.notes", "Notes")}
          </label>
          <Textarea {...register("notes")} readOnly={isReadOnly} className="text-xs resize-none" rows={3} />
        </div>
      </div>
    );
  }
);

TransferForm.displayName = "TransferForm";
