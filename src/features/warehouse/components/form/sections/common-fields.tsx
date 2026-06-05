"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ASSET_TYPE_LABELS,
  SERIALIZED_CATEGORIES,
  CABLE_CATEGORIES,
  CONSUMABLE_CATEGORIES,
  INFRASTRUCTURE_CATEGORIES,
  type AssetType,
  type UniversalAssetFormData,
} from "../../../types";

interface CommonFieldsProps {
  form: UseFormReturn<UniversalAssetFormData>;
  disabled?: boolean;
}

const CATEGORY_OPTIONS: Record<AssetType, { value: string; label: string }[]> = {
  serialized: SERIALIZED_CATEGORIES,
  cable: CABLE_CATEGORIES,
  consumable: CONSUMABLE_CATEGORIES,
  infrastructure: INFRASTRUCTURE_CATEGORIES,
};

const UOM_OPTIONS: Record<AssetType, string> = {
  serialized: "pieces",
  cable: "meters",
  consumable: "pieces",
  infrastructure: "pieces",
};

export function CommonFieldsSection({ form, disabled }: CommonFieldsProps) {
  const { register, control, formState: { errors }, watch, setValue } = form;
  const assetType = watch("assetType");

  const categoryOptions = CATEGORY_OPTIONS[assetType] || [];

  return (
    <div className="space-y-4">
      {/* Asset Type Selector */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Item Type *
        </Label>
        <Controller
          control={control}
          name="assetType"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(ASSET_TYPE_LABELS) as [AssetType, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      if (!disabled) {
                        field.onChange(value);
                        setValue("category", CATEGORY_OPTIONS[value][0]?.value as UniversalAssetFormData["category"]);
                        setValue("uom", UOM_OPTIONS[value]);
                      }
                    }}
                    className={`rounded-lg border p-3 text-left text-xs font-medium transition-colors ${
                      field.value === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          )}
        />
        {errors.assetType && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.assetType.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Category *
        </Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Item Name *
        </Label>
        <Input
          type="text"
          placeholder="e.g. Huawei HG8145V5"
          className="h-10 text-xs"
          {...register("name")}
          disabled={disabled}
        />
        {errors.name && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* SKU + Brand + Model */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            SKU Code *
          </Label>
          <Input
            type="text"
            placeholder="e.g. HW-ONT-992"
            className="h-10 text-xs"
            {...register("sku")}
            disabled={disabled}
          />
          {errors.sku && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.sku.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Brand *
          </Label>
          <Input
            type="text"
            placeholder="e.g. Huawei"
            className="h-10 text-xs"
            {...register("brand")}
            disabled={disabled}
          />
          {errors.brand && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.brand.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Model *
          </Label>
          <Input
            type="text"
            placeholder="e.g. HG8145V5"
            className="h-10 text-xs"
            {...register("model")}
            disabled={disabled}
          />
          {errors.model && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.model.message}
            </p>
          )}
        </div>
      </div>

      {/* UoM + Unit Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Unit of Measurement
          </Label>
          <Input
            type="text"
            className="h-10 text-xs bg-muted"
            readOnly
            {...register("uom")}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Unit Cost
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("unitCost", { valueAsNumber: true })}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Received By + Threshold */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Received By *
          </Label>
          <Input
            type="text"
            placeholder="e.g. Budi Santoso"
            className="h-10 text-xs"
            {...register("receivedBy")}
            disabled={disabled}
          />
          {errors.receivedBy && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.receivedBy.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Min Stock Threshold *
          </Label>
          <Input
            type="number"
            placeholder="10"
            className="h-10 text-xs"
            {...register("threshold", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.threshold && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.threshold.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Description
        </Label>
        <Input
          type="text"
          placeholder="Optional description"
          className="h-10 text-xs"
          {...register("description")}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
