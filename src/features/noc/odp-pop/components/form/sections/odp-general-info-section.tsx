"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import {
  RiSignalTowerLine,
  RiInformationLine,
  RiHashtag,
  RiStackLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OdpFormValues } from "../../../types/odp";

type OdpGeneralInfoSectionProps = {
  readOnly: boolean;
  isPending: boolean;
  nextSuffix: string;
  mode: "new" | "edit" | "details";
};

export function OdpGeneralInfoSection({
  readOnly,
  isPending,
  nextSuffix,
  mode,
}: OdpGeneralInfoSectionProps) {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<OdpFormValues>();
  const codeValue = watch("code") || "";

  const getMiddlePart = (fullCode: string) => {
    if (!fullCode) return "";
    const parts = fullCode.split("-");
    if (parts.length > 2) {
      return parts.slice(1, -1).join("-");
    }
    return "";
  };

  const [middle, setMiddle] = useState(() => getMiddlePart(codeValue));

  // Keep middle in sync with full code when loaded/selected ODP changes
  useEffect(() => {
    setMiddle(getMiddlePart(codeValue));
  }, [codeValue]);

  // Handle change of the middle part
  const handleMiddleChange = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    setMiddle(cleaned);
    setValue("code", cleaned ? `ODP-${cleaned}-${nextSuffix}` : "", { shouldValidate: true });
  };

  // Ensure code is synced on mount/when nextSuffix changes for new mode
  useEffect(() => {
    if (mode === "new" && middle) {
      setValue("code", `ODP-${middle}-${nextSuffix}`, { shouldValidate: true });
    }
  }, [middle, nextSuffix, mode, setValue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiSignalTowerLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("odpPop.generalInformation")}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiHashtag className="size-3" />
                {t("common.code")}
              </FormLabel>
              <FormControl>
                <div className="flex items-center rounded-lg border border-input bg-background pl-3 focus-within:ring-1 focus-within:ring-ring h-10 w-full">
                  <span className="text-sm font-semibold text-muted-foreground/60 select-none">ODP-</span>
                  <Input
                    className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 text-sm uppercase h-full bg-transparent font-medium"
                    placeholder={t("odpPop.locationPlaceholder")}
                    value={middle}
                    onChange={(e) => handleMiddleChange(e.target.value)}
                    disabled={readOnly || isPending || mode !== "new"}
                  />
                  <span className="text-sm font-semibold text-muted-foreground/60 select-none pr-3">-{nextSuffix}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">{t("odpPop.odpName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("odpPop.odpNamePlaceholder", "ODP LABUAN MAIN")} {...field} disabled={readOnly || isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="total_port"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiStackLine className="size-3" />
                {t("odpPop.totalPorts")}
              </FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
                disabled={readOnly || isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("odpPop.selectPorts")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiInformationLine className="size-3" />
                {t("common.status")}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={readOnly || isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("odpPop.selectStatus")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UP">Up</SelectItem>
                  <SelectItem value="DOWN">Down</SelectItem>
                  <SelectItem value="DEGRADED">Degraded</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
