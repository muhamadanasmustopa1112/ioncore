"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  RiFileList3Line,
  RiAddLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { type OnboardingFormValues } from "../../../types/onboarding-schema";

const ACCEPTED_FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "docx", label: "DOCX" },
];

interface DocumentsSectionProps {
  form: UseFormReturn<OnboardingFormValues>;
  disabled: boolean;
}

export function DocumentsSection({ form, disabled }: DocumentsSectionProps) {
  const { register, watch, setValue, control, formState: { errors } } = form;

  const {
    fields: docFields,
    append: appendDoc,
    remove: removeDoc,
  } = useFieldArray({ control, name: "required_documents" });

  const toggleDocFormat = (docIndex: number, format: string) => {
    const current = watch(`required_documents.${docIndex}.accepted_formats`) ?? [];
    if (current.includes(format)) {
      setValue(
        `required_documents.${docIndex}.accepted_formats`,
        current.filter((f) => f !== format)
      );
    } else {
      setValue(`required_documents.${docIndex}.accepted_formats`, [...current, format]);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiFileList3Line className="size-4 text-green-500" />
        <h3 className="text-sm font-semibold">Required Documents</h3>
      </div>
      <div className="space-y-4">
        {docFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-md border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Document {index + 1}
              </span>
              {!disabled && (
                <Button
                  type="button"
                  mode="icon"
                  variant="ghost"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeDoc(index)}
                >
                  <RiDeleteBinLine className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Document Name</Label>
                <Input
                  placeholder="e.g. KTP"
                  disabled={disabled}
                  {...register(`required_documents.${index}.document_name`)}
                />
                {errors.required_documents?.[index]?.document_name && (
                  <p className="text-xs text-red-500">
                    {errors.required_documents[index]?.document_name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Max Size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  disabled={disabled}
                  {...register(`required_documents.${index}.max_size_mb`, { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                <Input
                  placeholder="e.g. Kartu Tanda Penduduk"
                  disabled={disabled}
                  {...register(`required_documents.${index}.description`)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Accepted Formats</Label>
                <div className="flex flex-wrap gap-4">
                  {ACCEPTED_FORMAT_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={
                          watch(`required_documents.${index}.accepted_formats`)?.includes(
                            opt.value
                          ) ?? false
                        }
                        onCheckedChange={() => toggleDocFormat(index, opt.value)}
                        disabled={disabled}
                      />
                      <span className="text-xs text-muted-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.required_documents?.[index]?.accepted_formats && (
                  <p className="text-xs text-red-500">
                    {errors.required_documents[index]?.accepted_formats?.message}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Required</Label>
                <Switch
                  size="sm"
                  checked={watch(`required_documents.${index}.required`)}
                  onCheckedChange={(v) => setValue(`required_documents.${index}.required`, v)}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendDoc({
                document_id: `doc-${Date.now()}`,
                document_name: "",
                required: true,
                description: "",
                accepted_formats: ["pdf"],
                max_size_mb: 5,
                validation: "manual",
              })
            }
          >
            <RiAddLine className="size-4 mr-1" />
            Add Document
          </Button>
        )}
      </div>
    </div>
  );
}
