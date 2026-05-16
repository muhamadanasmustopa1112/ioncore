"use client";

import { Trash2, GripVertical } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { WorkOrderFormValues, WoCategory, WoCaptureType } from "../../../types/work-order-schema";

interface Props {
  id: string;
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

const CAPTURE_TYPES: { value: WoCaptureType; label: string }[] = [
  { value: "photo", label: "Photo" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "checkbox", label: "Checkbox" },
  { value: "barcode_scan", label: "Barcode / QR Scan" },
  { value: "file_upload", label: "File Upload" },
  { value: "signature", label: "Signature" },
];

export function PowItemRow({ id, index, form, isDetailMode, onRemove }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
  const prefix = `proof_of_work.${index}` as const;
  const itemErrors = errors.proof_of_work?.[index];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDetailMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isDetailMode && (
            <button
              type="button"
              className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </button>
          )}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Order #{index + 1}
          </span>
        </div>
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
          <Label className="text-xs font-medium text-muted-foreground">Capture Type</Label>
          <Select
            value={watch(`${prefix}.field_type`)}
            onValueChange={(v) => setValue(`${prefix}.field_type`, v as WoCaptureType)}
            disabled={isDetailMode}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CAPTURE_TYPES.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Instruction (Markdown)</Label>
        <Textarea
          placeholder="Describe what the technician must do for this step…"
          rows={2}
          disabled={isDetailMode}
          className="resize-none text-sm"
          {...register(`${prefix}.instruction_markdown`)}
        />
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
