"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OWNERSHIP_OPTIONS,
  DEVICE_CONDITION_OPTIONS,
  type UniversalAssetFormData,
} from "../../../types";

interface SerializedFieldsProps {
  form: UseFormReturn<UniversalAssetFormData>;
  disabled?: boolean;
}

export function SerializedFieldsSection({ form, disabled }: SerializedFieldsProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-foreground">
        Serialized Device Details
      </h4>

      {/* Serial Number + MAC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Serial Number *
          </Label>
          <Input
            type="text"
            placeholder="e.g. SN-HUA99210"
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
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            MAC Address
          </Label>
          <Input
            type="text"
            placeholder="e.g. AA:BB:CC:DD:EE:FF"
            className="h-10 text-xs"
            {...register("macAddress")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Firmware */}
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Firmware Version
        </Label>
        <Input
          type="text"
          placeholder="e.g. V300R019C10"
          className="h-10 text-xs"
          {...register("firmwareVersion")}
          disabled={disabled}
        />
      </div>

      {/* Ownership + Condition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ownership Type *
          </Label>
          <Controller
            control={control}
            name="ownershipType"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="Select ownership" />
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.ownershipType && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.ownershipType.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Condition *
          </Label>
          <Controller
            control={control}
            name="deviceCondition"
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
                  {DEVICE_CONDITION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.deviceCondition && (
            <p className="text-[10px] font-bold text-red-500">
              {errors.deviceCondition.message}
            </p>
          )}
        </div>
      </div>

      {/* Purchase Cost + Received At */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Purchase Cost
          </Label>
          <Input
            type="number"
            placeholder="0"
            className="h-10 text-xs"
            {...register("purchaseCost", { valueAsNumber: true })}
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Received At
          </Label>
          <Input
            type="datetime-local"
            className="h-10 text-xs"
            {...register("receivedAt")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Is Retrofit */}
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isRetrofit"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
        <Label className="text-xs font-normal text-foreground">
          This is a retrofit unit (assembled from cannibalized components)
        </Label>
      </div>
    </div>
  );
}
