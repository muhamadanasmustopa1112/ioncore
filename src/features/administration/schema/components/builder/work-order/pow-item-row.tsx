"use client";

import { Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { WorkOrderFormValues, WoCategory, WoFieldType } from "../../../types/work-order-schema";

interface Props {
  index: number;
  form: UseFormReturn<WorkOrderFormValues>;
  isDetailMode: boolean;
  onRemove: () => void;
}

const CATEGORIES: { value: WoCategory; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "serial", label: "Serial Number" },
  { value: "test", label: "Test Result" },
  { value: "inspection", label: "Inspection" },
  { value: "signature", label: "Signature" },
  { value: "other", label: "Other" },
];

const FIELD_TYPES: { value: WoFieldType; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
];

export function PowItemRow({ index, form, isDetailMode, onRemove }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const prefix = `proof_of_work.${index}` as const;
  const itemErrors = errors.proof_of_work?.[index];

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Item #{index + 1}
        </span>
        {!isDetailMode && (
          <Button variant="ghost" mode="icon" className="size-7 text-destructive" onClick={onRemove}>
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Item ID <span className="text-red-500">*</span></Label>
          <Input
            placeholder="e.g. pow-install-1"
            disabled={isDetailMode}
            {...register(`${prefix}.item_id`)}
          />
          {itemErrors?.item_id && <p className="text-xs text-red-500">{itemErrors.item_id.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Label <span className="text-red-500">*</span></Label>
          <Input
            placeholder="e.g. Before photo"
            disabled={isDetailMode}
            {...register(`${prefix}.item_label`)}
          />
          {itemErrors?.item_label && <p className="text-xs text-red-500">{itemErrors.item_label.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Category</Label>
          <Select
            value={watch(`${prefix}.category`)}
            onValueChange={(v) => setValue(`${prefix}.category`, v as WoCategory)}
            disabled={isDetailMode}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Field Type</Label>
          <Select
            value={watch(`${prefix}.field_type`)}
            onValueChange={(v) => setValue(`${prefix}.field_type`, v as WoFieldType)}
            disabled={isDetailMode}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2">
        <Label className="text-xs font-medium">Required</Label>
        <Switch
          size="sm"
          checked={watch(`${prefix}.required`)}
          onCheckedChange={(v) => setValue(`${prefix}.required`, v)}
          disabled={isDetailMode}
        />
      </div>
    </div>
  );
}
