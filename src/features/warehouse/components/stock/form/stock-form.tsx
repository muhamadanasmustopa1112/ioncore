"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateStockItem } from "@/features/warehouse/api/post-stock-item";
import { useCreatePurchaseReceipt } from "@/features/warehouse/api/post-purchase-receipt";
import { useCategories } from "@/features/warehouse/api/get-categories";
import { toast } from "sonner";

// Schema 1: Stock Item Catalog
const stockItemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  category_id: z.number().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  valuation_method: z.string().min(1, "Valuation method is required"),
  active: z.boolean(),
  requires_serial_at_intake: z.boolean(),
  sub_warehouse_allowed: z.boolean(),
  default_install_wo_subtype: z.string(),
  default_maintenance_schedule_id: z.string(),
  default_required_skills: z.string(),
});

// Schema 2: Purchase Receipt
const purchaseReceiptSchema = z.object({
  warehouse_id: z.number().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_cost: z.number().min(0, "Unit cost is required"),
  vendor_name: z.string().min(1, "Vendor name is required"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  serials: z.string().optional(),
  mac_addresses: z.string().optional(),
  notes: z.string().optional(),
});

// Combined schema for form
const combinedSchema = stockItemSchema.merge(purchaseReceiptSchema);
type StockItemFormValues = z.infer<typeof combinedSchema>;

const WAREHOUSE_OPTIONS = [
  { id: 1, name: "Gudang Jakarta Utara" },
  { id: 2, name: "Gudang Bandung Utara" },
  { id: 3, name: "Gudang Surabaya" },
];

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
    const { mutate: createStockItem, isPending } = useCreateStockItem();
    const { mutate: createPurchaseReceipt, isPending: isPendingReceipt } = useCreatePurchaseReceipt();

    const { data: categoriesResponse } = useCategories();
    const categories = categoriesResponse?.data ?? [];

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<StockItemFormValues>({
      resolver: zodResolver(combinedSchema),
      defaultValues: {
        // Stock item fields
        name: "",
        sku: "",
        brand: "",
        model: "",
        category_id: 0,
        unit: "",
        valuation_method: "FIFO",
        active: true,
        requires_serial_at_intake: false,
        sub_warehouse_allowed: true,
        default_install_wo_subtype: "",
        default_maintenance_schedule_id: "",
        default_required_skills: "",
        // Purchase receipt fields
        warehouse_id: 1,
        quantity: 1,
        unit_cost: 0,
        vendor_name: "",
        purchase_date: new Date().toISOString().split("T")[0],
        serials: "",
        mac_addresses: "",
        notes: "",
      },
    });

    const requiresSerial = watch("requires_serial_at_intake");

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
      isPending: isPending || isPendingReceipt,
    }));

    function onSubmit(values: StockItemFormValues) {
      const skillsArray = values.default_required_skills
        ? values.default_required_skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      // Step 1: Create stock item catalog entry
      createStockItem(
        {
          name: values.name,
          sku: values.sku,
          brand: values.brand,
          model: values.model,
          category_id: values.category_id,
          unit: values.unit,
          valuation_method: values.valuation_method,
          active: values.active,
          requires_serial_at_intake: values.requires_serial_at_intake,
          sub_warehouse_allowed: values.sub_warehouse_allowed,
          default_install_wo_subtype: values.default_install_wo_subtype,
          default_maintenance_schedule_id: values.default_maintenance_schedule_id || undefined,
          default_required_skills: skillsArray,
        },
        {
          onSuccess: (stockItemResponse) => {
            // Step 2: Create purchase receipt with initial stock
            const stockItemId = stockItemResponse.id;

            createPurchaseReceipt(
              {
                destination_warehouse_id: values.warehouse_id,
                lines: [
                  {
                    stock_item_id: stockItemId,
                    quantity: values.quantity,
                    unit_cost: values.unit_cost,
                    serials: values.serials
                      ? values.serials.split(",").map((s) => s.trim()).filter(Boolean)
                      : [],
                    mac_addresses: values.mac_addresses
                      ? values.mac_addresses.split(",").map((s) => s.trim()).filter(Boolean)
                      : [],
                  },
                ],
                vendor_name: values.vendor_name,
                purchase_date: values.purchase_date,
                received_at: new Date().toISOString(),
                notes: values.notes,
              },
              {
                onSuccess: () => {
                  toast.success("Stock item and purchase receipt created");
                  onSuccess();
                },
                onError: () => {
                  toast.error("Stock item created but purchase receipt failed");
                },
              }
            );
          },
          onError: () => {
            toast.error("Failed to create stock item");
          },
        }
      );
    }

    const isReadOnly = mode === "details";

    return (
      <div className="space-y-5 px-1 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.itemName", "Item Name")} *
            </label>
            <Input {...register("name")} disabled={isReadOnly} placeholder="e.g. ONT ZTE F670L" className="text-xs h-10" />
            {errors.name && <p className="text-[10px] text-destructive font-bold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              SKU *
            </label>
            <Input {...register("sku")} disabled={isReadOnly} placeholder="e.g. ONT-ZTE-F670L" className="text-xs h-10 font-mono" />
            {errors.sku && <p className="text-[10px] text-destructive font-bold">{errors.sku.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.brand", "Brand")} *
            </label>
            <Input {...register("brand")} disabled={isReadOnly} placeholder="e.g. ZTE" className="text-xs h-10" />
            {errors.brand && <p className="text-[10px] text-destructive font-bold">{errors.brand.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.model", "Model")} *
            </label>
            <Input {...register("model")} disabled={isReadOnly} placeholder="e.g. F670L" className="text-xs h-10" />
            {errors.model && <p className="text-[10px] text-destructive font-bold">{errors.model.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.category", "Category")} *
            </label>
            <select
              {...register("category_id", { valueAsNumber: true })}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-[10px] text-destructive font-bold">{errors.category_id.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.unit", "Unit")} *
            </label>
            <Input {...register("unit")} disabled={isReadOnly} placeholder="e.g. pcs, meters" className="text-xs h-10" />
            {errors.unit && <p className="text-[10px] text-destructive font-bold">{errors.unit.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.valuationMethod", "Valuation Method")} *
            </label>
            <select
              {...register("valuation_method")}
              disabled={isReadOnly}
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="FIFO">FIFO</option>
              <option value="LIFO">LIFO</option>
            </select>
            {errors.valuation_method && <p className="text-[10px] text-destructive font-bold">{errors.valuation_method.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.installWoSubtype", "Install WO Subtype")}
            </label>
            <Input {...register("default_install_wo_subtype")} disabled={isReadOnly} placeholder="e.g. ont_install" className="text-xs h-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.maintenanceSchedule", "Maintenance Schedule")}
            </label>
            <Input {...register("default_maintenance_schedule_id")} disabled={isReadOnly} placeholder="e.g. MONTHLY, P90D" className="text-xs h-10" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t("warehouse.requiredSkills", "Required Skills")}
            </label>
            <Input {...register("default_required_skills")} disabled={isReadOnly} placeholder="Comma separated, e.g. fiber_install, ont_activation" className="text-xs h-10" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("active")} disabled={isReadOnly} className="size-4 rounded border-input" />
            <span className="text-xs font-bold text-muted-foreground">{t("warehouse.active", "Active")}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("requires_serial_at_intake")} disabled={isReadOnly} className="size-4 rounded border-input" />
            <span className="text-xs font-bold text-muted-foreground">{t("warehouse.requiresSerial", "Requires Serial at Intake")}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("sub_warehouse_allowed")} disabled={isReadOnly} className="size-4 rounded border-input" />
            <span className="text-xs font-bold text-muted-foreground">{t("warehouse.subWarehouseAllowed", "Sub-warehouse Allowed")}</span>
          </label>
        </div>

        {/* Purchase Receipt Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Purchase Receipt Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Warehouse *
              </label>
              <select
                {...register("warehouse_id", { valueAsNumber: true })}
                disabled={isReadOnly}
                className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                {WAREHOUSE_OPTIONS.map((wh) => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
              {errors.warehouse_id && <p className="text-[10px] text-destructive font-bold">{errors.warehouse_id.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quantity *
              </label>
              <Input type="number" {...register("quantity", { valueAsNumber: true })} disabled={isReadOnly} className="text-xs h-10" />
              {errors.quantity && <p className="text-[10px] text-destructive font-bold">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Unit Cost *
              </label>
              <Input type="number" {...register("unit_cost", { valueAsNumber: true })} disabled={isReadOnly} className="text-xs h-10" />
              {errors.unit_cost && <p className="text-[10px] text-destructive font-bold">{errors.unit_cost.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Vendor Name *
              </label>
              <Input {...register("vendor_name")} disabled={isReadOnly} placeholder="e.g. PT Supplier Utama" className="text-xs h-10" />
              {errors.vendor_name && <p className="text-[10px] text-destructive font-bold">{errors.vendor_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Purchase Date *
              </label>
              <Input type="date" {...register("purchase_date")} disabled={isReadOnly} className="text-xs h-10" />
              {errors.purchase_date && <p className="text-[10px] text-destructive font-bold">{errors.purchase_date.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Notes
              </label>
              <Input {...register("notes")} disabled={isReadOnly} placeholder="Optional notes" className="text-xs h-10" />
            </div>
          </div>

          {requiresSerial && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Serial Numbers
                </label>
                <Input {...register("serials")} disabled={isReadOnly} placeholder="Comma-separated serials" className="text-xs h-10" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  MAC Addresses
                </label>
                <Input {...register("mac_addresses")} disabled={isReadOnly} placeholder="Comma-separated MACs" className="text-xs h-10" />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 text-xs font-semibold"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="h-10 px-5 text-xs font-semibold"
            disabled={isPending || isPendingReceipt}
          >
            {isPending ? "Creating Item..." : isPendingReceipt ? "Creating Receipt..." : "Register Item"}
          </Button>
        </div>
      </div>
    );
  }
);

StockItemForm.displayName = "StockItemForm";
