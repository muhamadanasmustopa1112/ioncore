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
  INFRA_CONDITION_OPTIONS,
  DEPLOYMENT_STATUS_OPTIONS,
  type UniversalAssetFormData,
} from "../../../types";

interface InfrastructureFieldsProps {
  form: UseFormReturn<UniversalAssetFormData>;
  disabled?: boolean;
}

export function InfrastructureFieldsSection({ form, disabled }: InfrastructureFieldsProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-foreground">
        Infrastructure Equipment Details
      </h4>

      {/* Serial Number */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Serial Number *
        </Label>
        <Input
          type="text"
          placeholder="e.g. SN-OLT-2024-001"
          className="h-10 text-xs"
          {...register("serialNumber")}
          disabled={disabled}
        />
        {errors.serialNumber && (
          <p className="text-[10px] font-bold text-red-500">
            {errors.serialNumber.message}
          </p>
        )}
      </div>

      {/* Purchase Date + Distributor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchase Date *
          </Label>
          <Input
            type="date"
            className="h-10 text-xs"
            {...register("purchaseDate")}
            disabled={disabled}
          />
          {errors.purchaseDate && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.purchaseDate.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Distributor / Supplier *
          </Label>
          <Input
            type="text"
            placeholder="e.g. PT Teknologi Nusantara"
            className="h-10 text-xs"
            {...register("distributorName")}
            disabled={disabled}
          />
          {errors.distributorName && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.distributorName.message}
            </p>
          )}
        </div>
      </div>

      {/* Purchase Price + PO Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchase Price *
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("purchasePrice", { valueAsNumber: true })}
            disabled={disabled}
          />
          {errors.purchasePrice && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.purchasePrice.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            PO Reference
          </Label>
          <Input
            type="text"
            placeholder="e.g. PO-2026-001"
            className="h-10 text-xs"
            {...register("purchaseOrderReference")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Warranty Expiry */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Warranty Expiry Date
        </Label>
        <Input
          type="date"
          className="h-10 text-xs"
          {...register("warrantyExpiryDate")}
          disabled={disabled}
        />
      </div>

      {/* Condition + Deployment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Condition
          </Label>
          <Controller
            control={control}
            name="infraCondition"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {INFRA_CONDITION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deployment Status
          </Label>
          <Controller
            control={control}
            name="deploymentStatus"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DEPLOYMENT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Deployment Location + Network Node */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deployment Location
          </Label>
          <Input
            type="text"
            placeholder="e.g. POP Kelapa Gading"
            className="h-10 text-xs"
            {...register("deploymentLocation")}
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Network Node ID
          </Label>
          <Input
            type="text"
            placeholder="e.g. NODE-OLT-001"
            className="h-10 text-xs"
            {...register("networkNodeId")}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
