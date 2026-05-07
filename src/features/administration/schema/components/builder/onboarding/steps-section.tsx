"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  RiListCheck2,
  RiAddLine,
  RiDeleteBinLine,
} from "@remixicon/react";
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
import { Button } from "@/components/ui/button";
import { type OnboardingFormValues } from "../../../types/onboarding-schema";

interface StepsSectionProps {
  form: UseFormReturn<OnboardingFormValues>;
  disabled: boolean;
}

export function StepsSection({ form, disabled }: StepsSectionProps) {
  const { register, watch, setValue, control, formState: { errors } } = form;

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: "steps" });

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiListCheck2 className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">Onboarding Steps</h3>
      </div>
      <div className="space-y-4">
        {stepFields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-md border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Step {index + 1}
              </span>
              {!disabled && stepFields.length > 1 && (
                <Button
                  type="button"
                  mode="icon"
                  variant="ghost"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeStep(index)}
                >
                  <RiDeleteBinLine className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Step Name</Label>
                <Input
                  placeholder="e.g. Lead Verification"
                  disabled={disabled}
                  {...register(`steps.${index}.step_name`)}
                />
                {errors.steps?.[index]?.step_name && (
                  <p className="text-xs text-red-500">
                    {errors.steps[index]?.step_name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                <Select
                  value={watch(`steps.${index}.priority`)}
                  onValueChange={(v) =>
                    setValue(`steps.${index}.priority`, v as "low" | "medium" | "high")
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Work Order Type</Label>
                <Input
                  placeholder="e.g. installation"
                  disabled={disabled}
                  {...register(`steps.${index}.work_order_type`)}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Label className="text-xs font-medium text-muted-foreground">Required</Label>
                <Switch
                  size="lg"
                  checked={watch(`steps.${index}.required`)}
                  onCheckedChange={(v) => setValue(`steps.${index}.required`, v)}
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Automated</Label>
                <Switch
                  size="lg"
                  checked={watch(`steps.${index}.automated`)}
                  onCheckedChange={(v) => setValue(`steps.${index}.automated`, v)}
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
              appendStep({
                step_id: stepFields.length + 1,
                step_name: "",
                required: true,
                automated: false,
                work_order_type: "",
                priority: "medium",
                equipment_template: "",
                requires_approval: false,
                approval_workflow: "sequential",
              })
            }
          >
            <RiAddLine className="size-4 mr-1" />
            Add Step
          </Button>
        )}
        {errors.steps && !Array.isArray(errors.steps) && (
          <p className="text-xs text-red-500">{(errors.steps as { message?: string }).message}</p>
        )}
      </div>
    </div>
  );
}
