"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "../../store/warehouse";
import { useCreateStockItem } from "../../api/post-stock-item";
import { useCategories } from "../../api/get-categories";
import { toast } from "sonner";
import type { AssetCategory } from "../../types";

const ASSET_CATEGORY_VALUES = [
  "ONT", "Router", "Switch", "ODP_Box", "Media_Converter", "Patch_Panel",
  "Fiber_Optic", "Ethernet", "Coaxial", "Power",
  "Connector", "Fastener", "Patch_Cord", "Labeling", "Mounting",
  "ODP", "OLT", "Mikrotik", "Rack", "Power_Supply",
] as const;

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

const assetFormSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  category: z.enum(ASSET_CATEGORY_VALUES, { message: "Category is required" }),
  uom: z.string().min(1, "UoM is required"),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface AssetFormProps {
  onSuccess: () => void;
}

export function AssetForm({ onSuccess }: AssetFormProps) {
  const { addAsset } = useWarehouseStore();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data ?? [];

  const { mutate: createStockItem, isPending } = useCreateStockItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      brand: "",
      model: "",
      category: "ONT",
      uom: "pieces",
    },
  });

  const onSubmit = (values: AssetFormValues) => {
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
            category: "Equipment",
            brand: values.brand,
            model: values.model,
            units: 1,
            threshold: 10,
            uom: values.uom,
            receivedBy: "System",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Item Name *
          </label>
          <Input {...register("name")} placeholder="e.g. ONT ZTE F670L" className="text-xs h-10" />
          {errors.name && <p className="text-[10px] text-destructive font-bold">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            SKU *
          </label>
          <Input {...register("sku")} placeholder="e.g. ONT-ZTE-F670L" className="text-xs h-10 font-mono" />
          {errors.sku && <p className="text-[10px] text-destructive font-bold">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Brand *
          </label>
          <Input {...register("brand")} placeholder="e.g. ZTE" className="text-xs h-10" />
          {errors.brand && <p className="text-[10px] text-destructive font-bold">{errors.brand.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Model *
          </label>
          <Input {...register("model")} placeholder="e.g. F670L" className="text-xs h-10" />
          {errors.model && <p className="text-[10px] text-destructive font-bold">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Category *
          </label>
          <select
            {...register("category")}
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.category_code}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-[10px] text-destructive font-bold">{errors.category.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Unit of Measure *
          </label>
          <Input {...register("uom")} placeholder="e.g. pcs, meters" className="text-xs h-10" />
          {errors.uom && <p className="text-[10px] text-destructive font-bold">{errors.uom.message}</p>}
        </div>
      </div>

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
          disabled={isPending}
        >
          Register Item
        </Button>
      </div>
    </form>
  );
}
