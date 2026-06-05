"use client";

import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useCreatePurchaseReceipt } from "@/features/warehouse/api/post-purchase-receipt";
import { useStockItems } from "@/features/warehouse/api/get-stock-items";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import type { StockLevel } from "@/features/warehouse/types";
import { toast } from "sonner";

const purchaseReceiptSchema = z.object({
  stock_item_id: z.number().min(1, "Stock item is required"),
  warehouse_id: z.number().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Receive quantity must be at least 1"),
  threshold: z.number().min(0).optional(),
  unit_cost: z.number().min(0, "Unit cost is required"),
  vendor_name: z.string().min(1, "Vendor name is required"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  serials: z.string().optional(),
  mac_addresses: z.string().optional(),
  notes: z.string().optional(),
});

type PurchaseReceiptFormValues = z.infer<typeof purchaseReceiptSchema>;

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

function parseCommaList(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function getDefaultFormValues(): PurchaseReceiptFormValues {
  return {
    stock_item_id: 0,
    warehouse_id: 1,
    quantity: 1,
    threshold: undefined,
    unit_cost: 0,
    vendor_name: "",
    purchase_date: new Date().toISOString().split("T")[0],
    serials: "",
    mac_addresses: "",
    notes: "",
  };
}

function getInitialFormValues(
  mode: "new" | "edit" | "details",
  selectedStock: StockLevel | null
): PurchaseReceiptFormValues {
  if (mode === "edit" && selectedStock) {
    return {
      ...getDefaultFormValues(),
      stock_item_id: Number(selectedStock.stockItemId),
      warehouse_id: Number(selectedStock.warehouseId),
      threshold: selectedStock.threshold,
      quantity: 1,
    };
  }
  return getDefaultFormValues();
}

interface ReadOnlyFieldProps {
  label: string;
  children: React.ReactNode;
}

function ReadOnlyField({ label, children }: ReadOnlyFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="rounded-md border border-input bg-muted/30 px-3 py-2.5">
        {children}
      </div>
    </div>
  );
}

export interface StockItemFormRef {
  submit: () => void;
  isPending: boolean;
}

interface StockItemFormProps {
  onSuccess: () => void;
  mode: "new" | "edit" | "details";
}

export const StockItemForm = forwardRef<StockItemFormRef, StockItemFormProps>(
  ({ onSuccess, mode }, ref) => {
    const { t } = useTranslation();
    const { selectedStock } = useWarehouseStore();
    const { mutate: createPurchaseReceipt, isPending } = useCreatePurchaseReceipt();
    const { data: stockItemsResponse } = useStockItems();
    const stockItems = stockItemsResponse?.data ?? [];

    const isEditMode = mode === "edit" && !!selectedStock;

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<PurchaseReceiptFormValues>({
      resolver: zodResolver(purchaseReceiptSchema),
      defaultValues: getInitialFormValues(mode, selectedStock),
    });

    const selectedStockItemId = watch("stock_item_id");

    const selectedStockItem = useMemo(
      () => stockItems.find((item) => item.id === selectedStockItemId),
      [stockItems, selectedStockItemId]
    );

    const requiresSerial =
      selectedStockItem?.requires_serial_at_intake ??
      selectedStock?.stockItemType === "serialized";

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending,
    }));

    function onSubmit(values: PurchaseReceiptFormValues) {
      createPurchaseReceipt(
        {
          destination_warehouse_id: values.warehouse_id,
          lines: [
            {
              stock_item_id: values.stock_item_id,
              quantity: values.quantity,
              unit_cost: values.unit_cost,
              serials: parseCommaList(values.serials),
              mac_addresses: parseCommaList(values.mac_addresses),
            },
          ],
          vendor_name: values.vendor_name,
          purchase_date: values.purchase_date,
          received_at: new Date().toISOString(),
          notes: values.notes,
        },
        {
          onSuccess: () => {
            toast.success("Purchase receipt created");
            onSuccess();
          },
        }
      );
    }

    return (
      <div className="space-y-5 px-1 py-2 pb-6">
        {isEditMode && selectedStock ? (
          <>
            <input type="hidden" {...register("stock_item_id", { valueAsNumber: true })} />
            <input type="hidden" {...register("warehouse_id", { valueAsNumber: true })} />

            <ReadOnlyField label={t("warehouse.stockItem", "Stock Item")}>
              <p className="text-sm font-medium text-foreground">
                {selectedStock.stockItemName}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                SKU: {selectedStock.stockItemSku}
              </p>
            </ReadOnlyField>

            <ReadOnlyField label={t("warehouse.warehouse", "Warehouse")}>
              <p className="text-sm font-medium text-foreground">
                {selectedStock.warehouseName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {selectedStock.warehouseBranch}
              </p>
            </ReadOnlyField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadOnlyField label={t("warehouse.stockStatus", "Current Stock")}>
                <p className="text-sm font-bold text-foreground">
                  {selectedStock.currentStock.toLocaleString()}{" "}
                  <span className="text-xs font-medium text-muted-foreground">
                    {selectedStock.uom}
                  </span>
                </p>
              </ReadOnlyField>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("warehouse.thresholdLabel", "Threshold")} *
                </label>
                <Input
                  type="number"
                  {...register("threshold", { valueAsNumber: true })}
                  className="text-xs h-10"
                />
                {errors.threshold && (
                  <p className="text-[10px] text-destructive font-bold">{errors.threshold.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("warehouse.receiveQuantity", "Receive Quantity")} *
              </label>
              <Input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                className="text-xs h-10"
              />
              {errors.quantity && (
                <p className="text-[10px] text-destructive font-bold">{errors.quantity.message}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("warehouse.stockItem", "Stock Item")} *
              </label>
              <select
                {...register("stock_item_id", { valueAsNumber: true })}
                className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">Select stock item</option>
                {stockItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
              {errors.stock_item_id && (
                <p className="text-[10px] text-destructive font-bold">{errors.stock_item_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("warehouse.warehouse", "Warehouse")} *
                </label>
                <select
                  {...register("warehouse_id", { valueAsNumber: true })}
                  className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  {WAREHOUSE_OPTIONS.map((wh) => (
                    <option key={wh.id} value={wh.id}>{wh.name}</option>
                  ))}
                </select>
                {errors.warehouse_id && (
                  <p className="text-[10px] text-destructive font-bold">{errors.warehouse_id.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("warehouse.receiveQuantity", "Receive Quantity")} *
                </label>
                <Input
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  className="text-xs h-10"
                />
                {errors.quantity && (
                  <p className="text-[10px] text-destructive font-bold">{errors.quantity.message}</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.unitCost", "Unit Cost")} *
            </label>
            <Input
              type="number"
              {...register("unit_cost", { valueAsNumber: true })}
              className="text-xs h-10"
            />
            {errors.unit_cost && (
              <p className="text-[10px] text-destructive font-bold">{errors.unit_cost.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.vendorName", "Vendor Name")} *
            </label>
            <Input
              {...register("vendor_name")}
              placeholder="e.g. PT Supplier Utama"
              className="text-xs h-10"
            />
            {errors.vendor_name && (
              <p className="text-[10px] text-destructive font-bold">{errors.vendor_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.purchaseDate", "Purchase Date")} *
            </label>
            <Input
              type="date"
              {...register("purchase_date")}
              className="text-xs h-10"
            />
            {errors.purchase_date && (
              <p className="text-[10px] text-destructive font-bold">{errors.purchase_date.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.notes", "Notes")}
            </label>
            <Input
              {...register("notes")}
              placeholder="Optional notes"
              className="text-xs h-10"
            />
          </div>
        </div>

        {requiresSerial && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("warehouse.serialNumbers", "Serial Numbers")}
              </label>
              <Input
                {...register("serials")}
                placeholder="Comma-separated serials"
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("warehouse.macAddresses", "MAC Addresses")}
              </label>
              <Input
                {...register("mac_addresses")}
                placeholder="Comma-separated MACs"
                className="text-xs h-10"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

StockItemForm.displayName = "StockItemForm";
