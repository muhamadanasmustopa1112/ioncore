"use client";

import { useCallback, useEffect, useState } from "react";
import { RiInformationLine, RiMapPin2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
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
import { useCoverageStore } from "../../../store/coverage";
import { CoveragePayload } from "../../../types/coverage-api";

interface CoverageFormProps {
  onSubmit?: (payload: CoveragePayload) => void;
}

export function CoverageForm({ onSubmit }: CoverageFormProps) {
  const { t } = useTranslation();
  const { form, selectedCoverage } = useCoverageStore();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [serviceAreas, setServiceAreas] = useState("");
  const [warehouseCoverage, setWarehouseCoverage] = useState("");
  const [networkScope, setNetworkScope] = useState("");
  const [dispatchRadius, setDispatchRadius] = useState("");

  useEffect(() => {
    if (selectedCoverage && (form === "edit" || form === "details")) {
      const json = selectedCoverage.coverageJson;
      setName(selectedCoverage.name);
      setDescription(selectedCoverage.description);
      setIsActive(selectedCoverage.isActive ? "true" : "false");
      setServiceAreas(json.service_area?.join(", ") ?? "");
      setWarehouseCoverage(json.warehouse_coverage?.join(", ") ?? "");
      setNetworkScope(json.network_scope ?? "");
      setDispatchRadius(json.dispatch_radius_km?.toString() ?? "");
    } else if (form === "new") {
      setName("");
      setDescription("");
      setIsActive("true");
      setServiceAreas("");
      setWarehouseCoverage("");
      setNetworkScope("");
      setDispatchRadius("");
    }
  }, [selectedCoverage, form]);

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return;
    const parseCommaList = (val: string) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    onSubmit({
      name,
      description,
      is_active: isActive === "true",
      coverage_json: {
        service_area: parseCommaList(serviceAreas),
        warehouse_coverage: parseCommaList(warehouseCoverage),
        network_scope: networkScope,
        dispatch_radius_km: dispatchRadius ? parseFloat(dispatchRadius) : 0,
      },
    });
  }, [
    name,
    description,
    isActive,
    serviceAreas,
    warehouseCoverage,
    networkScope,
    dispatchRadius,
    onSubmit,
  ]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__coverageFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>)
        .__coverageFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          <div className="space-y-4">
            <div className="border-border/50 flex items-center gap-2 border-b pb-2">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">
                {t("administration.branch.coverage.generalInformation")}
              </h3>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium">
                {t("administration.branch.coverage.name")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={t(
                  "administration.branch.coverage.namePlaceholder",
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium">
                {t("administration.branch.coverage.description")}
              </Label>
              <Textarea
                placeholder={t(
                  "administration.branch.coverage.descriptionPlaceholder",
                )}
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium">
                {t("administration.branch.coverage.status")}
              </Label>
              {isDetailMode ? (
                <Input
                  value={
                    isActive === "true"
                      ? t("administration.branch.coverage.active")
                      : t("administration.branch.coverage.inactive")
                  }
                  disabled
                />
              ) : (
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">
                      {t("administration.branch.coverage.active")}
                    </SelectItem>
                    <SelectItem value="false">
                      {t("administration.branch.coverage.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="border-border/50 flex items-center gap-2 border-b pb-1">
              <RiMapPin2Line className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">
                {t("administration.branch.coverage.coverageDetails")}
              </h3>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium">
                {t("administration.branch.coverage.serviceAreasField")}
              </Label>
              <Textarea
                placeholder={t(
                  "administration.branch.coverage.serviceAreasPlaceholder",
                )}
                className="min-h-[72px] resize-none"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                disabled={isDetailMode}
              />
              <p className="text-muted-foreground/70 text-[11px]">
                {t("administration.branch.coverage.serviceAreasHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-medium">
                {t("administration.branch.coverage.warehouseCoverage")}
              </Label>
              <Textarea
                placeholder={t(
                  "administration.branch.coverage.warehouseCoveragePlaceholder",
                )}
                className="min-h-[72px] resize-none"
                value={warehouseCoverage}
                onChange={(e) => setWarehouseCoverage(e.target.value)}
                disabled={isDetailMode}
              />
              <p className="text-muted-foreground/70 text-[11px]">
                {t("administration.branch.coverage.warehouseCoverageHint")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium">
                  {t("administration.branch.coverage.networkScope")}
                </Label>
                <Input
                  placeholder={t(
                    "administration.branch.coverage.networkScopePlaceholder",
                  )}
                  value={networkScope}
                  onChange={(e) => setNetworkScope(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs font-medium">
                  {t("administration.branch.coverage.dispatchRadius")}
                </Label>
                <Input
                  type="number"
                  placeholder={t(
                    "administration.branch.coverage.dispatchRadiusPlaceholder",
                  )}
                  value={dispatchRadius}
                  onChange={(e) => setDispatchRadius(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
