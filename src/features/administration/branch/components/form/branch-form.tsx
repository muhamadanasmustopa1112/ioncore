"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiInformationLine, RiMapPin2Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBranchStore } from "../../store/branch";
import { useAreaList, useRegionalList } from "../../api/branch-queries";
import { BranchLevel } from "../../types";

// ─── Schema ───────────────────────────────────────────────────────────────────

const branchSchema = z
  .object({
    name: z.string().min(1, "Branch name is required"),
    code: z.string().min(1, "Branch code is required"),
    level: z.enum(["regional", "area", "sub_area"]),
    active: z.boolean(),
    regionalId: z.string().optional(),
    areaId: z.string().optional(),
    address: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.level === "area" || data.level === "sub_area") {
      if (!data.regionalId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Regional branch is required",
          path: ["regionalId"],
        });
      }
    }
    if (data.level === "sub_area") {
      if (!data.areaId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Area branch is required",
          path: ["areaId"],
        });
      }
    }
  });

type BranchFormValues = z.infer<typeof branchSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface BranchFormProps {
  onSubmit?: (payload: {
    name: string;
    code: string;
    is_active: boolean;
    level: BranchLevel;
    regionalId?: string;
    areaId?: string;
  }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BranchForm({ onSubmit }: BranchFormProps) {
  const { form: formMode, selectedBranch } = useBranchStore();
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const { data: regionals = [] } = useRegionalList();

  const defaultValues = useMemo(
    () => ({
      name: "",
      code: "",
      level: "regional" as const,
      active: true,
      regionalId: "",
      areaId: "",
      address: "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues,
  });

  const level = watch("level");
  const regionalId = watch("regionalId") ?? "";

  const { data: areas = [] } = useAreaList(regionalId);

  const isRegional = level === "regional";
  const isArea = level === "area";
  const isSubArea = level === "sub_area";

  // Populate form when editing or viewing
  useEffect(() => {
    if (selectedBranch && (isEditMode || isDetailMode)) {
      reset({
        name: selectedBranch.name,
        code: selectedBranch.code,
        level: selectedBranch.level,
        active: selectedBranch.active,
        regionalId: selectedBranch._regionalId ?? "",
        areaId: selectedBranch._areaId ?? "",
        address: selectedBranch.address ?? "",
      });
    }
    if (!selectedBranch && !isEditMode && !isDetailMode) {
      reset({
        name: "",
        code: "",
        level: "regional",
        active: true,
        regionalId: "",
        areaId: "",
        address: "",
      });
    }
  }, [selectedBranch, isEditMode, isDetailMode, reset]);

  // Reset parent IDs when level changes in create mode
  useEffect(() => {
    if (!isEditMode && !isDetailMode) {
      setValue("regionalId", "");
      setValue("areaId", "");
    }
  }, [level, isEditMode, isDetailMode, setValue]);

  const onFormSubmit = (values: BranchFormValues) => {
    onSubmit?.({
      name: values.name,
      code: values.code,
      is_active: values.active,
      level: values.level,
      regionalId: isRegional ? undefined : values.regionalId,
      areaId: isSubArea ? values.areaId : undefined,
    });
  };

  // Expose submit via window so SheetFooter button can trigger it
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__branchFormSubmit =
      handleSubmit(onFormSubmit);
    return () => {
      delete (window as unknown as Record<string, unknown>).__branchFormSubmit;
    };
  });

  const levelDisplayName = (l: BranchLevel) =>
    l === "sub_area" ? "Sub Area" : l.charAt(0).toUpperCase() + l.slice(1);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* General Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Branch Name */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Branch Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Jakarta Pusat Area"
                  {...register("name")}
                  disabled={isDetailMode}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Branch Code */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Branch Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. JKT-PST"
                  {...register("code", {
                    onChange: (e) =>
                      setValue("code", e.target.value.toUpperCase()),
                  })}
                  disabled={isDetailMode}
                  className="font-mono uppercase"
                />
                {errors.code && (
                  <p className="text-xs text-destructive">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Branch Level */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Branch Level <span className="text-red-500">*</span>
                </Label>
                {isDetailMode || isEditMode ? (
                  <Input value={levelDisplayName(level)} disabled />
                ) : (
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) =>
                          field.onChange(val as BranchLevel)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regional">Regional</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                          <SelectItem value="sub_area">Sub Area</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Status
                </Label>
                {isDetailMode ? (
                  <Input
                    value={watch("active") ? "Active" : "Inactive"}
                    disabled
                  />
                ) : (
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(val) => field.onChange(val === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Regional (Parent) */}
            {(isArea || isSubArea) && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Regional (Parent) <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input
                    value={
                      regionals.find((r) => r.id === regionalId)?.name ??
                      regionalId
                    }
                    disabled
                  />
                ) : (
                  <Controller
                    name="regionalId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={(v) => {
                          field.onChange(v === "none" ? "" : v);
                          setValue("areaId", "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Regional Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionals.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.regionalId && (
                  <p className="text-xs text-destructive">
                    {errors.regionalId.message}
                  </p>
                )}
              </div>
            )}

            {/* Area (Parent) */}
            {isSubArea && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Area (Parent) <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input
                    value={
                      areas.find((a) => a.id === watch("areaId"))?.name ??
                      watch("areaId")
                    }
                    disabled
                  />
                ) : (
                  <Controller
                    name="areaId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? "" : v)
                        }
                        disabled={!regionalId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !regionalId
                                ? "Select Regional first"
                                : "Select Area Branch"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.areaId && (
                  <p className="text-xs text-destructive">
                    {errors.areaId.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPin2Line className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Location</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Address
              </Label>
              <Textarea
                placeholder="Enter branch address..."
                className="min-h-[80px] resize-none"
                {...register("address")}
                disabled={isDetailMode}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
