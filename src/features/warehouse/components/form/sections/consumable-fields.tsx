"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UniversalAssetFormData } from "../../../types";

interface ConsumableFieldsProps {
  form: UseFormReturn<UniversalAssetFormData>;
  disabled?: boolean;
}

export function ConsumableFieldsSection({ form, disabled }: ConsumableFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-foreground">
        Consumable Details
      </h4>

      {/* Specification */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Specification *
        </Label>
        <Input
          type="text"
          placeholder="e.g. SC/APC Connector, Cable Tie 200mm"
          className="h-10 text-xs"
          {...register("consumableSpec")}
          disabled={disabled}
        />
        {errors.consumableSpec && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.consumableSpec.message}
          </p>
        )}
      </div>

      {/* Quantity + Cost Per Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quantity In Stock *
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("quantityInStock", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.quantityInStock && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.quantityInStock.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cost Per Unit *
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("costPerUnit", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.costPerUnit && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.costPerUnit.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
