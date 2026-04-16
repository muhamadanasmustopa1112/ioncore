"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useCoverageStore } from "../../../store/coverage";
import { CoveragePayload } from "../../../types/coverage-api";

interface CoverageFormProps {
  onSubmit?: (payload: CoveragePayload) => void;
}

export function CoverageForm({ onSubmit }: CoverageFormProps) {
  const { form, selectedCoverage } = useCoverageStore();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [serviceArea, setServiceArea] = useState("");
  const [warehouseCoverage, setWarehouseCoverage] = useState("");
  const [networkScope, setNetworkScope] = useState("");
  const [dispatchRadius, setDispatchRadius] = useState("");

  useEffect(() => {
    if (selectedCoverage && (form === "edit" || form === "details")) {
      setName(selectedCoverage.name);
      setDescription(selectedCoverage.description);
      setIsActive(selectedCoverage.isActive ? "true" : "false");
      setServiceArea(selectedCoverage.coverageJson.service_area.join(", "));
      setWarehouseCoverage(
        selectedCoverage.coverageJson.warehouse_coverage.join(", ")
      );
      setNetworkScope(selectedCoverage.coverageJson.network_scope);
      setDispatchRadius(
        selectedCoverage.coverageJson.dispatch_radius_km?.toString() ?? ""
      );
    } else if (form === "new") {
      setName("");
      setDescription("");
      setIsActive("true");
      setServiceArea("");
      setWarehouseCoverage("");
      setNetworkScope("");
      setDispatchRadius("");
    }
  }, [selectedCoverage, form]);

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return;
    onSubmit({
      name,
      description,
      is_active: isActive === "true",
      coverage_json: {
        service_area: serviceArea
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        warehouse_coverage: warehouseCoverage
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        network_scope: networkScope,
        dispatch_radius_km: Number(dispatchRadius) || 0,
      },
    });
  }, [name, description, isActive, serviceArea, warehouseCoverage, networkScope, dispatchRadius, onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__coverageFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__coverageFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General Information</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Jakarta Selatan Coverage"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                placeholder="Describe the service area covered by this branch..."
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              {isDetailMode ? (
                <Input
                  value={isActive === "true" ? "Active" : "Inactive"}
                  disabled
                />
              ) : (
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Coverage JSON */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPin2Line className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Coverage Details</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Service Areas
              </Label>
              <Textarea
                placeholder="e.g. Kebayoran Baru, Tebet, Setiabudi"
                className="min-h-[72px] resize-none"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                disabled={isDetailMode}
              />
              {!isDetailMode && (
                <p className="text-[11px] text-muted-foreground">
                  Comma-separated list of service area names.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Warehouse Coverage
              </Label>
              <Textarea
                placeholder="e.g. Gudang JKT-01, Gudang JKT-02"
                className="min-h-[60px] resize-none"
                value={warehouseCoverage}
                onChange={(e) => setWarehouseCoverage(e.target.value)}
                disabled={isDetailMode}
              />
              {!isDetailMode && (
                <p className="text-[11px] text-muted-foreground">
                  Comma-separated list of warehouse names.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Network Scope
                </Label>
                <Input
                  placeholder="e.g. metro"
                  value={networkScope}
                  onChange={(e) => setNetworkScope(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Dispatch Radius (km)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={dispatchRadius}
                  onChange={(e) => setDispatchRadius(e.target.value)}
                  disabled={isDetailMode}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
