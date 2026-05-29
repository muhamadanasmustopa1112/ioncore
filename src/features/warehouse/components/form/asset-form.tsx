"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UploadCloud, CheckCircle2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "../../store/warehouse";
import { ImportExportDialog } from "./import-export-dialog";

const assetSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category: z.enum(["Cables", "Equipment", "Connectors"]),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(2, "Model is required"),
  units: z.coerce.number().min(0, "Units must be positive"),
  threshold: z.coerce.number().min(1, "Threshold must be at least 1"),
  uom: z.string().min(1, "UoM is required"),
  receivedBy: z.string().min(2, "Received by name is required"),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  onSuccess: () => void;
}

export function AssetForm({ onSuccess }: AssetFormProps) {
  const { addAsset } = useWarehouseStore();
  const [showImportExport, setShowImportExport] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      category: "Equipment",
      uom: "pieces",
      units: 0,
      threshold: 10,
    },
  });

  const selectedCategory = watch("category");

  // Dynamic UoM override based on Category
  useEffect(() => {
    if (selectedCategory === "Cables") {
      setValue("uom", "meters");
    } else if (selectedCategory === "Equipment") {
      setValue("uom", "pieces");
    } else if (selectedCategory === "Connectors") {
      setValue("uom", "pieces");
    }
  }, [selectedCategory, setValue]);

  const onSubmit = (values: any) => {
    addAsset({
      name: values.name,
      sku: values.sku,
      category: values.category,
      brand: values.brand,
      model: values.model,
      units: values.units,
      threshold: values.threshold,
      uom: values.uom,
      receivedBy: values.receivedBy,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1 py-2">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Item Name *
        </label>
        <Input
          type="text"
          placeholder="e.g. Huawei HG8145V5"
          className="text-xs h-10"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>
        )}
      </div>

      {/* Grid: SKU, Brand, Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SKU */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            SKU Code *
          </label>
          <Input
            type="text"
            placeholder="e.g. HW-ONT-992"
            className="text-xs h-10"
            {...register("sku")}
          />
          {errors.sku && (
            <p className="text-[10px] text-red-500 font-bold">{errors.sku.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Category *
          </label>
          <select
            className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("category")}
          >
            <option value="Equipment">Equipment (OLT, ONT, Router, ODP)</option>
            <option value="Cables">Cables</option>
            <option value="Connectors">Connectors/Splitters</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brand */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Brand *
          </label>
          <Input
            type="text"
            placeholder="e.g. Huawei"
            className="text-xs h-10"
            {...register("brand")}
          />
          {errors.brand && (
            <p className="text-[10px] text-red-500 font-bold">{errors.brand.message}</p>
          )}
        </div>

        {/* Model */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Model *
          </label>
          <Input
            type="text"
            placeholder="e.g. HG8145V5"
            className="text-xs h-10"
            {...register("model")}
          />
          {errors.model && (
            <p className="text-[10px] text-red-500 font-bold">{errors.model.message}</p>
          )}
        </div>
      </div>

      {/* Received By */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Received By *
        </label>
        <Input
          type="text"
          placeholder="e.g. Budi Santoso"
          className="text-xs h-10"
          {...register("receivedBy")}
        />
        {errors.receivedBy && (
          <p className="text-[10px] text-red-500 font-bold">{errors.receivedBy.message}</p>
        )}
      </div>

      {/* Quantities and UoM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Initial Stock */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Initial Stock *
          </label>
          <Input
            type="number"
            placeholder="0"
            className="text-xs h-10"
            {...register("units")}
          />
          {errors.units && (
            <p className="text-[10px] text-red-500 font-bold">{errors.units.message}</p>
          )}
        </div>

        {/* Reorder Point / Minimum Stock */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Min Stock Threshold *
          </label>
          <Input
            type="number"
            placeholder="10"
            className="text-xs h-10"
            {...register("threshold")}
          />
          {errors.threshold && (
            <p className="text-[10px] text-red-500 font-bold">{errors.threshold.message}</p>
          )}
        </div>

        {/* UoM */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Unit of Measurement (UoM)
          </label>
          {selectedCategory === "Connectors" ? (
            <select
              className="flex w-full bg-background border border-input h-10 px-3 rounded-md text-xs text-foreground focus:outline-hidden"
              {...register("uom")}
            >
              <option value="pieces">pieces</option>
              <option value="boxes">boxes</option>
            </select>
          ) : (
            <Input
              type="text"
              className="text-xs h-10 bg-slate-50 dark:bg-slate-900"
              readOnly
              {...register("uom")}
            />
          )}
        </div>
      </div>


      {/* Image Upload Simulation */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Upload Image & Documentation
        </label>
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-5 text-center hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors cursor-pointer flex flex-col items-center gap-2">
          <UploadCloud className="size-8 text-slate-400" />
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Drag & drop files here</p>
            <p className="text-[10px] text-slate-400">PNG, JPG, PDF up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowImportExport(true)}
          className="h-10 px-4 font-semibold text-xs flex items-center gap-2"
        >
          <FileText className="size-4" />
          Import/Export
        </Button>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 font-semibold text-xs"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="h-10 px-5 font-semibold text-xs"
            disabled={isSubmitting}
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
