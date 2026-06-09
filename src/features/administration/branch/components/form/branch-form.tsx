"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiInformationLine, RiMapPinLine } from "@remixicon/react";
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
import { useAreaList, useBranchTree, useRegionalList } from "../../api/branch-queries";
import { BranchData, BranchLevel, GeographicPolygon } from "../../types";
import {
  BRANCH_CODE_LENGTH,
  generateUniqueBranchCode,
} from "../../utils/generate-branch-code";

const branchSchema = z
  .object({
    name: z.string().min(1, "Branch name is required"),
    code: z
      .string()
      .max(BRANCH_CODE_LENGTH, `Branch code must be at most ${BRANCH_CODE_LENGTH} characters`)
      .optional(),
    type: z.enum(["office", "noc", "warehouse"]),
    level: z.enum(["regional", "area", "sub_area"]),
    active: z.boolean(),
    regionalId: z.string().optional(),
    areaId: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().optional(),
    long: z.number().optional(),
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
    if (data.level !== "sub_area") {
      const code = data.code?.trim() ?? "";
      if (!code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Branch code is required",
          path: ["code"],
        });
      }
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

const toPolygonString = (value?: GeographicPolygon | string | null) => {
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

interface BranchFormProps {
  branchData?: BranchData | null;
  onSubmit?: (payload: {
    name: string;
    code?: string;
    is_active: boolean;
    type: string;
    level: BranchLevel;
    regionalId?: string;
    areaId?: string;
    address?: string;
    geographic_polygon?: GeographicPolygon;
    lat?: number;
    long?: number;
  }) => void;
}

export function BranchForm({ onSubmit, branchData }: BranchFormProps) {
  const { t } = useTranslation();
  const formMode = useBranchStore((s) => s.form);
  const storedBranch = useBranchStore((s) => s.selectedBranch);
  const defaultNewType = useBranchStore((s) => s.defaultNewType);
  const selectedBranch = branchData ?? storedBranch;
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const defaultValues = useMemo(
    () => ({
      name: "",
      code: "",
      type: (defaultNewType as "office" | "noc" | "warehouse") ?? "office",
      level: "regional" as const,
      active: true,
      regionalId: "",
      areaId: "",
      address: "",
      lat: undefined as number | undefined,
      long: undefined as number | undefined,
      geographic_polygon: "",
    }),
    [defaultNewType],
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
        lat: selectedBranch.lat,
        long: selectedBranch.long,
        geographic_polygon: toPolygonString(selectedBranch.geographic_polygon),
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

  const isSubArea = level === "sub_area";

  const { data: allBranches = [] } = useBranchTree();
  const existingCodes = useMemo(
    () => allBranches.map((branch) => branch.code),
    [allBranches],
  );

  useEffect(() => {
    if (isEditMode || isDetailMode || isSubArea) return;
    const generated = generateUniqueBranchCode(name, existingCodes);
    setValue("code", generated, { shouldValidate: false });
  }, [name, existingCodes, isSubArea, isEditMode, isDetailMode, setValue]);

  const { data: regionals = [] } = useRegionalList();
  const { data: areas = [] } = useAreaList(regionalId);

  const isRegional = level === "regional";
  const isArea = level === "area";

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
      lat: values.lat,
      long: values.long,
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
  }, []);

  const levelDisplayName = (l: BranchLevel) => {
    const key = l === "sub_area" ? "subArea" : l;
    return t(`administration.branch.${key}`);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.form.generalInformation")}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.branchLevel")} <span className="text-red-500">*</span>
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
                          <SelectValue placeholder={t("administration.branch.form.selectLevel")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regional">{t("administration.branch.regional")}</SelectItem>
                          <SelectItem value="area">{t("administration.branch.area")}</SelectItem>
                          <SelectItem value="sub_area">{t("administration.branch.subArea")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.branchType")} <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input value={t(`administration.branch.${watch("type")}`)} disabled />
                ) : (
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={(v) => { field.onChange(v); clearParents(); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">{t("administration.branch.office")}</SelectItem>
                          <SelectItem value="noc">{t("administration.branch.noc")}</SelectItem>
                          <SelectItem value="warehouse">{t("administration.branch.warehouse")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.branchName")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder={t("administration.branch.form.branchNamePlaceholder")}
                  {...register("name")}
                  disabled={isDetailMode}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>
            {(!isSubArea || isEditMode || isDetailMode) && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.branchCode")} {!isEditMode && !isDetailMode && <span className="text-red-500">*</span>}
                  {!isDetailMode && !isEditMode && (
                    <span className="ml-2 text-[10px] font-normal text-muted-foreground/60">{t("administration.branch.form.codeHintAuto")}</span>
                  )}
                  {(isEditMode || isDetailMode) && (
                    <span className="ml-2 text-[10px] font-normal text-muted-foreground/60">{t("administration.branch.form.codeHintSystem")}</span>
                  )}
                </Label>
                <Input
                  placeholder={t("administration.branch.form.branchCodePlaceholder")}
                  maxLength={BRANCH_CODE_LENGTH}
                  {...register("code")}
                  disabled={isDetailMode || isEditMode}
                  className="font-mono uppercase"
                />
                {errors.code && (
                  <p className="text-xs text-destructive">{errors.code.message}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{t("administration.branch.form.status")}</Label>
                {isDetailMode ? (
                  <Input value={watch("active") ? t("administration.branch.form.active") : t("administration.branch.form.inactive")} disabled />
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
                          <SelectItem value="true">{t("administration.branch.form.active")}</SelectItem>
                          <SelectItem value="false">{t("administration.branch.form.inactive")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </div>
            </div>

            {(isArea || isSubArea) && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.regionalParent")} <span className="text-red-500">*</span>
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
                          <SelectValue placeholder={selectedBranch?._regionalName ?? t("administration.branch.form.selectRegional")} />
                        </SelectTrigger>
                        <SelectContent>
                          {regionals.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                              {t("administration.branch.form.noRegionalAvailable")} &quot;{branchType}&quot;
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

            {isSubArea && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.form.areaParent")} <span className="text-red-500">*</span>
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
                            placeholder={!regionalId ? t("administration.branch.form.selectRegionalFirst") : (selectedBranch?._areaName ?? t("administration.branch.form.selectArea"))}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.length === 0 ? (
                            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                              {t("administration.branch.form.noAreaAvailable")}{regionalId ? ` for type &quot;${branchType}&quot;` : ""}
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

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPinLine className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.form.locationBoundary")}</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">{t("administration.branch.form.address")}</Label>
              <Textarea
                placeholder={t("administration.branch.form.addressPlaceholder")}
                className="min-h-[72px] resize-none"
                {...register("address")}
                disabled={isDetailMode}
              />
            </div>
            <div className="space-y-2">
              <PolygonPreview
                pinLat={watch("lat")}
                pinLng={watch("long")}
                onPinChange={isDetailMode ? undefined : (lat, lng) => { setValue("lat", lat); setValue("long", lng); }}
                polygonValue={watch("geographic_polygon") ?? ""}
                onPolygonChange={isDetailMode ? undefined : (v) => setValue("geographic_polygon", v)}
                readOnly={isDetailMode}
              />
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.form.coveragePolygon")}
                <span className="ml-1.5 text-muted-foreground/60 font-normal">{t("administration.branch.form.polygonHint")}</span>
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