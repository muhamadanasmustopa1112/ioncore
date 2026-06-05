"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "../../store/warehouse";
import { ImportExportDialog } from "./import-export-dialog";
import { CommonFieldsSection } from "./sections/common-fields";
import { SerializedFieldsSection } from "./sections/serialized-fields";
import { CableFieldsSection } from "./sections/cable-fields";
import { ConsumableFieldsSection } from "./sections/consumable-fields";
import { InfrastructureFieldsSection } from "./sections/infrastructure-fields";
import { useCreateStockItem } from "../../api/post-stock-item";
import { useCategories } from "../../api/get-categories";
import { toast } from "sonner";
import type {
  AssetType,
  AssetCategory,
  UniversalAssetFormData,
  SerializedCategory,
  CableCategory,
  ConsumableCategory,
  InfrastructureCategory,
} from "../../types";

const ASSET_CATEGORY_VALUES = [
  "ONT", "Router", "Switch", "ODP_Box", "Media_Converter", "Patch_Panel",
  "Fiber_Optic", "Ethernet", "Coaxial", "Power",
  "Connector", "Fastener", "Patch_Cord", "Labeling", "Mounting",
  "ODP", "OLT", "Mikrotik", "Rack", "Power_Supply",
] as const;

const SERIALIZED_CATEGORIES: SerializedCategory[] = ["ONT", "Router", "Switch", "ODP_Box", "Media_Converter", "Patch_Panel"];
const CABLE_CATEGORIES: CableCategory[] = ["Fiber_Optic", "Ethernet", "Coaxial", "Power"];
const CONSUMABLE_CATEGORIES: ConsumableCategory[] = ["Connector", "Fastener", "Patch_Cord", "Labeling", "Mounting"];
const INFRA_CATEGORIES: InfrastructureCategory[] = ["ODP", "OLT", "Mikrotik", "Switch", "Rack", "Power_Supply"];

function mapCategoryToLowStock(category: AssetCategory): "Cables" | "Equipment" | "Connectors" {
  if ((CABLE_CATEGORIES as string[]).includes(category)) return "Cables";
  if ((CONSUMABLE_CATEGORIES as string[]).includes(category)) return "Connectors";
  return "Equipment";
}

function mapFormCategoryToCategoryId(
  category: AssetCategory,
  categories: { id: number; category_code: string }[]
): number | undefined {
  const categoryMap: Record<AssetCategory, string> = {
    ONT: "ONT",
    Router: "ROUTER",
    Switch: "SWITCH",
    ODP_Box: "ODP_BOX",
    Media_Converter: "MEDIA_CONVERTER",
    Patch_Panel: "PATCH_PANEL",
    Fiber_Optic: "FIBER_OPTIC",
    Ethernet: "ETHERNET",
    Coaxial: "COAXIAL",
    Power: "POWER",
    Connector: "CONNECTOR",
    Fastener: "FASTENER",
    Patch_Cord: "PATCH_CORD",
    Labeling: "LABELING",
    Mounting: "MOUNTING",
    ODP: "ODP",
    OLT: "OLT",
    Mikrotik: "MIKROTIK",
    Rack: "RACK",
    Power_Supply: "POWER_SUPPLY",
  };
  const code = categoryMap[category];
  return categories.find((c) => c.category_code === code)?.id;
}

const universalAssetSchema = z
  .object({
    // Common
    assetType: z.enum(["serialized", "cable", "consumable", "infrastructure"]),
    category: z.enum(ASSET_CATEGORY_VALUES, { message: "Category is required" }),
    name: z.string().min(3, "Item name must be at least 3 characters"),
    sku: z.string().min(3, "SKU must be at least 3 characters"),
    brand: z.string().min(2, "Brand is required"),
    model: z.string().min(2, "Model is required"),
    uom: z.string().min(1, "UoM is required"),
    unitCost: z.number().min(0).optional(),
    description: z.string().optional(),
    threshold: z.number().min(1, "Threshold must be at least 1"),
    receivedBy: z.string().min(2, "Received by name is required"),

    // Serialized
    serialNumber: z.string().optional(),
    macAddress: z.string().optional(),
    firmwareVersion: z.string().optional(),
    ownershipType: z.enum(["ion_owned", "leased_to_customer", "customer_owned"]).optional(),
    deviceCondition: z.enum(["new", "refurbished", "damaged"]).optional(),
    purchaseCost: z.number().min(0).optional(),
    receivedAt: z.string().optional(),
    isRetrofit: z.boolean().optional(),

    // Cable
    specification: z.string().optional(),
    totalLength: z.number().min(0).optional(),
    costPerMeter: z.number().min(0).optional(),

    // Consumable
    consumableSpec: z.string().optional(),
    quantityInStock: z.number().min(0).optional(),
    costPerUnit: z.number().min(0).optional(),

    // Infrastructure
    purchaseDate: z.string().optional(),
    distributorName: z.string().optional(),
    purchasePrice: z.number().min(0).optional(),
    purchaseOrderReference: z.string().optional(),
    warrantyExpiryDate: z.string().optional(),
    infraCondition: z.enum(["new", "active", "under_maintenance", "decommissioned"]).optional(),
    deploymentStatus: z.enum(["in_warehouse", "deployed", "under_maintenance", "decommissioned"]).optional(),
    deploymentLocation: z.string().optional(),
    networkNodeId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.assetType === "serialized") {
      if (!data.serialNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["serialNumber"],
          message: "Serial number is required",
        });
      }
      if (!data.ownershipType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ownershipType"],
          message: "Ownership type is required",
        });
      }
      if (!data.deviceCondition) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["deviceCondition"],
          message: "Condition is required",
        });
      }
    }
    if (data.assetType === "cable") {
      if (!data.specification) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specification"],
          message: "Specification is required",
        });
      }
      if (!data.totalLength || data.totalLength <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalLength"],
          message: "Total length is required",
        });
      }
      if (!data.costPerMeter || data.costPerMeter <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["costPerMeter"],
          message: "Cost per meter is required",
        });
      }
    }
    if (data.assetType === "consumable") {
      if (!data.consumableSpec) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["consumableSpec"],
          message: "Specification is required",
        });
      }
      if (data.quantityInStock === undefined || data.quantityInStock < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantityInStock"],
          message: "Quantity is required",
        });
      }
      if (!data.costPerUnit || data.costPerUnit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["costPerUnit"],
          message: "Cost per unit is required",
        });
      }
    }
    if (data.assetType === "infrastructure") {
      if (!data.serialNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["serialNumber"],
          message: "Serial number is required",
        });
      }
      if (!data.purchaseDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["purchaseDate"],
          message: "Purchase date is required",
        });
      }
      if (!data.distributorName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["distributorName"],
          message: "Distributor name is required",
        });
      }
      if (!data.purchasePrice || data.purchasePrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["purchasePrice"],
          message: "Purchase price is required",
        });
      }
    }
  });

interface AssetFormProps {
  onSuccess: () => void;
}

export function AssetForm({ onSuccess }: AssetFormProps) {
  const { addAsset } = useWarehouseStore();
  const [showImportExport, setShowImportExport] = useState(false);
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data ?? [];

  const { mutate: createStockItem, isPending } = useCreateStockItem();

  const form = useForm<UniversalAssetFormData>({
    resolver: zodResolver(universalAssetSchema),
    defaultValues: {
      assetType: "serialized",
      category: "ONT" as AssetCategory,
      uom: "pieces",
      threshold: 10,
      isRetrofit: false,
    },
  });

  const { handleSubmit, watch } = form;
  const assetType = watch("assetType");

  const onSubmit = (values: UniversalAssetFormData) => {
    const categoryId = mapFormCategoryToCategoryId(values.category, categories);
    if (!categoryId) {
      toast.error("Invalid category selected");
      return;
    }

    const matchedCategory = categories.find((c) => c.id === categoryId);

    createStockItem(
      {
        name: values.name,
        sku: values.sku,
        brand: values.brand,
        model: values.model,
        category_id: categoryId,
        unit: values.uom,
        valuation_method: "FIFO",
        active: true,
        requires_serial_at_intake: matchedCategory?.requires_serial_at_intake ?? false,
        sub_warehouse_allowed: matchedCategory?.sub_warehouse_allowed_default ?? true,
        default_install_wo_subtype: matchedCategory?.default_install_wo_subtype ?? "",
        default_required_skills: matchedCategory?.default_required_skills ?? [],
        default_maintenance_schedule_id: matchedCategory?.default_maintenance_schedule_id,
      },
      {
        onSuccess: () => {
          addAsset({
            name: values.name,
            sku: values.sku,
            category: mapCategoryToLowStock(values.category),
            brand: values.brand,
            model: values.model,
            units: values.assetType === "cable"
              ? (values.totalLength || 0)
              : values.assetType === "consumable"
                ? (values.quantityInStock || 0)
                : 1,
            threshold: values.threshold,
            uom: values.uom,
            receivedBy: values.receivedBy,
          });
          toast.success("Asset registered successfully");
          onSuccess();
        },
        onError: () => {
          toast.error("Failed to register asset");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1 py-2">
      <CommonFieldsSection form={form} />

      {assetType === "serialized" && <SerializedFieldsSection form={form} />}
      {assetType === "cable" && <CableFieldsSection form={form} />}
      {assetType === "consumable" && <ConsumableFieldsSection form={form} />}
      {assetType === "infrastructure" && <InfrastructureFieldsSection form={form} />}

      {/* Image Upload Simulation */}
      <div className="space-y-1 border-t pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Upload Image & Documentation
        </label>
        <div className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-5 text-center transition-colors hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/10">
          <UploadCloud className="size-8 text-slate-400" />
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Drag & drop files here
            </p>
            <p className="text-[10px] text-slate-400">
              PNG, JPG, PDF up to 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowImportExport(true)}
          className="flex h-10 items-center gap-2 px-4 text-xs font-semibold"
        >
          <FileText className="size-4" />
          Import/Export
        </Button>

        <div className="flex gap-3">
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
            disabled={isPending || form.formState.isSubmitting}
          >
            Register Item
          </Button>
        </div>
      </div>

      {/* Import/Export Dialog */}
      <ImportExportDialog
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
      />
    </form>
  );
}
