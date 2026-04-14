"use client";

import { useEffect, useState } from "react";
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
import { useCoverageStore } from "../../../store/coverage";
import { CoveragePayload } from "../../../types/coverage-api";

interface CoverageFormProps {
  onSubmit?: (payload: CoveragePayload) => void;
}

export function CoverageForm({ onSubmit }: CoverageFormProps) {
  const { form, selectedCoverage } = useCoverageStore();
  const isDetailMode = form === "details";

  const [areaName, setAreaName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    if (selectedCoverage && (form === "edit" || form === "details")) {
      setAreaName(selectedCoverage.areaName);
      setVillage(selectedCoverage.village);
      setDistrict(selectedCoverage.district);
      setCity(selectedCoverage.city);
      setProvince(selectedCoverage.province);
      setPostalCode(selectedCoverage.postalCode);
      setIsActive(selectedCoverage.isActive ? "true" : "false");
    }
  }, [selectedCoverage, form]);

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit({
      area_name: areaName,
      village: village || undefined,
      district: district || undefined,
      city,
      province,
      postal_code: postalCode || undefined,
      is_active: isActive === "true",
    });
  };

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__coverageFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__coverageFormSubmit;
    };
  });

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Area Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Kelapa Gading Barat"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
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
          </div>

          {/* Location */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPin2Line className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Location Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Village (Kelurahan)
                </Label>
                <Input
                  placeholder="e.g. Kelapa Gading Barat"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  District (Kecamatan)
                </Label>
                <Input
                  placeholder="e.g. Kelapa Gading"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Jakarta Utara"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Province <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. DKI Jakarta"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Postal Code
                </Label>
                <Input
                  placeholder="e.g. 14240"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={isDetailMode}
                  className="font-mono"
                  maxLength={5}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
