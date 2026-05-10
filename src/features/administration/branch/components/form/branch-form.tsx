"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiInformationLine, RiMapPinLine } from "@remixicon/react";
import { RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PolygonPreview } from "./polygon-preview";
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
import { BranchData, BranchLevel, GeographicPolygon } from "../../types";

// ─── Code Generator ───────────────────────────────────────────────────────────

const TYPE_PREFIX: Record<string, string> = { office: "OFC", noc: "NOC", warehouse: "WHS" };
const LEVEL_PREFIX: Record<string, string> = { regional: "REG", area: "AREA", sub_area: "SUB" };

function generateBranchCode(type: string, level: string, name: string): string {
  const t = TYPE_PREFIX[type] ?? type.toUpperCase().slice(0, 3);
  const l = LEVEL_PREFIX[level] ?? level.toUpperCase().slice(0, 3);
  const n = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.slice(0, 3).toUpperCase())
    .join("-");
  return n ? `${t}-${l}-${n}` : `${t}-${l}`;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const branchSchema = z
  .object({
    name: z.string().min(1, "Branch name is required"),
    code: z.string().min(1, "Branch code is required"),
    type: z.enum(["office", "noc", "warehouse"]),
    level: z.enum(["regional", "area", "sub_area"]),
    active: z.boolean(),
    regionalId: z.string().optional(),
    areaId: z.string().optional(),
    address: z.string().optional(),
    geographic_polygon: z.string().optional().refine((val) => {
      if (!val) return true;
      const trimmed = val.trim();
      if (!trimmed || trimmed === "undefined") return true;
      try {
        const parsed = JSON.parse(trimmed);
        return !!parsed && typeof parsed === "object";
      } catch {
        return false;
      }
    }, "Must be valid JSON (GeoJSON coordinate array)"),
  })
  .superRefine((data, ctx) => {
    if ((data.level === "area" || data.level === "sub_area") && !data.regionalId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Regional (Parent) is required", path: ["regionalId"] });
    }
    if (data.level === "sub_area" && !data.areaId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Area (Parent) is required", path: ["areaId"] });
    }
  });

type BranchFormValues = z.infer<typeof branchSchema>;

const parseGeographicPolygon = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "undefined") return undefined;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") return parsed as GeographicPolygon;
    return undefined;
  } catch {
    return undefined;
  }
};

const toPolygonInputValue = (value?: GeographicPolygon | string | null) => {
  if (!value) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "undefined" ? "" : value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface BranchFormProps {
  branchData?: BranchData | null;
  onSubmit?: (payload: {
    name: string;
    code: string;
    is_active: boolean;
    type: string;
    level: BranchLevel;
    regionalId?: string;
    areaId?: string;
    address?: string;
    geographic_polygon?: GeographicPolygon;
  }) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BranchForm({ onSubmit, branchData }: BranchFormProps) {
  const formMode = useBranchStore((s) => s.form);
  const storedBranch = useBranchStore((s) => s.selectedBranch);
  const selectedBranch = branchData ?? storedBranch;
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const defaultValues = useMemo(
    () => ({
      name: "",
      code: "",
      type: "office" as const,
      level: "regional" as const,
      active: true,
      regionalId: "",
      areaId: "",
      address: "",
      geographic_polygon: "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const formValues = useMemo<BranchFormValues | undefined>(() => {
    if (selectedBranch && (isEditMode || isDetailMode)) {
      return {
        name: selectedBranch.name,
        code: selectedBranch.code,
        type: (selectedBranch.branchType as "office" | "noc" | "warehouse" | undefined) ?? "office",
        level: selectedBranch.level,
        active: selectedBranch.active,
        regionalId: selectedBranch._regionalId ?? "",
        areaId: selectedBranch._areaId ?? "",
        address: selectedBranch.address ?? "",
        geographic_polygon: toPolygonInputValue(selectedBranch.geographic_polygon),
      };
    }
    return undefined;
  }, [selectedBranch, isEditMode, isDetailMode]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues,
    values: formValues,
  });

  const level = watch("level");
  const branchType = watch("type");
  const name = watch("name");
  const regionalId = watch("regionalId") ?? "";

  const isCodeManual = useRef(isEditMode || isDetailMode);

  useEffect(() => {
    if (isEditMode || isDetailMode) { isCodeManual.current = true; return; }
    isCodeManual.current = false;
  }, [isEditMode, isDetailMode]);

  useEffect(() => {
    if (isCodeManual.current) return;
    setValue("code", generateBranchCode(branchType, level, name), { shouldValidate: false });
  }, [name, branchType, level, setValue]);

  const { data: regionals = [] } = useRegionalList(branchType);
  const { data: areas = [] } = useAreaList(regionalId, branchType);

  const isRegional = level === "regional";
  const isArea = level === "area";
  const isSubArea = level === "sub_area";

  const isLocked = isEditMode || isDetailMode;
  const clearParents = () => {
    if (isLocked) return;
    setValue("regionalId", "");
    setValue("areaId", "");
  };

  const onFormSubmit = (values: BranchFormValues) => {
    onSubmit?.({
      name: values.name,
      code: values.code,
      is_active: values.active,
      type: values.type,
      level: values.level,
      regionalId: isRegional ? undefined : values.regionalId,
      areaId: isSubArea ? values.areaId : undefined,
      address: values.address?.trim() || undefined,
      geographic_polygon: parseGeographicPolygon(values.geographic_polygon),
    });
  };

  const submitRef = useRef<(() => void) | undefined>(undefined);
  submitRef.current = handleSubmit(onFormSubmit);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__branchFormSubmit = () =>
      submitRef.current?.();
    return () => {
      delete (window as unknown as Record<string, unknown>).__branchFormSubmit;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
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
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Branch Code <span className="text-red-500">*</span>
                  {!isDetailMode && !isEditMode && (
                    <span className="ml-2 text-[10px] font-normal text-muted-foreground/60">
                      {isCodeManual.current ? "— manual" : "— auto generated"}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    placeholder="e.g. OFC-REG-JKT"
                    {...register("code", {
                      onChange: (e) => {
                        const auto = generateBranchCode(branchType, level, name);
                        isCodeManual.current = e.target.value !== auto;
                      },
                    })}
                    disabled={isDetailMode}
                    className="font-mono pr-8"
                  />
                  {!isDetailMode && !isEditMode && (
                    <button
                      type="button"
                      title="Reset to auto-generated code"
                      onClick={() => {
                        isCodeManual.current = false;
                        setValue("code", generateBranchCode(branchType, level, name), { shouldValidate: true });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                  )}
                </div>
                {errors.code && (
                  <p className="text-xs text-destructive">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Branch Type <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input value={watch("type").charAt(0).toUpperCase() + watch("type").slice(1)} disabled />
                ) : (
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(v) => { field.onChange(v); clearParents(); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="noc">NOC</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        onValueChange={(val) => { field.onChange(val as BranchLevel); clearParents(); }}
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

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                {isDetailMode ? (
                  <Input value={watch("active") ? "Active" : "Inactive"} disabled />
                ) : (
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(val) => field.onChange(val === "true")}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                      regionals.find((r) => r.id === regionalId)?.name
                      ?? selectedBranch?._regionalName
                      ?? regionalId
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
                          <SelectValue placeholder={selectedBranch?._regionalName ?? "Select Regional Branch"} />
                        </SelectTrigger>
                        <SelectContent>
                          {regionals.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                              No regional branches available for type &quot;{branchType}&quot;
                            </div>
                          ) : (
                            regionals.map((r) => (
                              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.regionalId && (
                  <p className="text-xs text-destructive">{errors.regionalId.message}</p>
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
                      areas.find((a) => a.id === watch("areaId"))?.name
                      ?? selectedBranch?._areaName
                      ?? watch("areaId")
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
                        onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                        disabled={!regionalId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={!regionalId ? "Select Regional first" : (selectedBranch?._areaName ?? "Select Area Branch")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                              No area branches available{regionalId ? ` for type "${branchType}"` : ""}
                            </div>
                          ) : (
                            areas.map((a) => (
                              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
                {errors.areaId && (
                  <p className="text-xs text-destructive">{errors.areaId.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Location & Geographic Boundary */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPinLine className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Location & Geographic Boundary</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Address</Label>
              <Textarea
                placeholder="Enter branch address..."
                className="min-h-[72px] resize-none"
                {...register("address")}
                disabled={isDetailMode}
              />
            </div>
            <div className="space-y-2">
              <PolygonPreview
                value={watch("geographic_polygon") ?? ""}
                onChange={isDetailMode ? undefined : (v) => setValue("geographic_polygon", v)}
                readOnly={isDetailMode}
              />
              <Label className="text-xs font-medium text-muted-foreground">
                Coverage Polygon
                <span className="ml-1.5 text-muted-foreground/60 font-normal">(GeoJSON Polygon — for address-to-area resolution)</span>
              </Label>
              {errors.geographic_polygon && (
                <p className="text-xs text-destructive">{errors.geographic_polygon.message}</p>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
