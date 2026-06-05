"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UniversalAssetFormData } from "../../../types";

interface CableFieldsProps {
  form: UseFormReturn<UniversalAssetFormData>;
  disabled?: boolean;
}

export function CableFieldsSection({ form, disabled }: CableFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-foreground">
        Cable Details
      </h4>

      {/* Specification */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Specification *
        </Label>
        <Input
          type="text"
          placeholder="e.g. SM G.657A2, Cat6 UTP, RG6"
          className="h-10 text-xs"
          {...register("specification")}
          disabled={disabled}
        />
        {errors.specification && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.specification.message}
          </p>
        )}
      </div>

      {/* Total Length + Cost Per Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Length (meters) *
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("totalLength", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.totalLength && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.totalLength.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cost Per Meter *
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("costPerMeter", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.costPerMeter && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.costPerMeter.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
