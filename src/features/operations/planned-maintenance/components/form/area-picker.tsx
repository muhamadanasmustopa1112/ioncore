"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DUMMY_AREAS } from "../../data/dummy-areas";
import type { MaintenanceAffectedArea } from "../../types";

type AreaPickerProps = {
  value: MaintenanceAffectedArea[];
  onChange: (areas: MaintenanceAffectedArea[]) => void;
  disabled?: boolean;
};

export function AreaPicker({ value, onChange, disabled }: AreaPickerProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  const selectedArea = useMemo(
    () => DUMMY_AREAS.find((a) => a.area_id === selectedAreaId),
    [selectedAreaId],
  );

  const toggleSubArea = (areaId: string, areaName: string, subAreaId: string, subAreaName: string) => {
    const existing = value.find((a) => a.area_id === areaId);
    const hasSubArea = existing?.sub_area_ids.includes(subAreaId) ?? false;

    let next: MaintenanceAffectedArea[];
    if (hasSubArea && existing) {
      const newSubIds = existing.sub_area_ids.filter((id) => id !== subAreaId);
      const newSubNames = existing.sub_area_names.filter((name, i) => existing!.sub_area_ids[i] !== subAreaId);
      if (newSubIds.length === 0) {
        next = value.filter((a) => a.area_id !== areaId);
      } else {
        next = value.map((a) => a.area_id === areaId ? { ...a, sub_area_ids: newSubIds, sub_area_names: newSubNames } : a);
      }
    } else {
      if (existing) {
        next = value.map((a) => a.area_id === areaId
          ? { ...a, sub_area_ids: [...a.sub_area_ids, subAreaId], sub_area_names: [...a.sub_area_names, subAreaName] }
          : a);
      } else {
        next = [...value, { area_id: areaId, area_name: areaName, sub_area_ids: [subAreaId], sub_area_names: [subAreaName] }];
      }
    }
    onChange(next);
  };

  const isSubAreaSelected = (areaId: string, subAreaId: string) => {
    return value.some((a) => a.area_id === areaId && a.sub_area_ids.includes(subAreaId));
  };

  const removeArea = (areaId: string) => {
    onChange(value.filter((a) => a.area_id !== areaId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((area) => (
          <Badge key={area.area_id} variant="outline" className="gap-1 pr-1">
            <span className="font-medium">{area.area_name}</span>
            <span className="text-[10px] opacity-70">({area.sub_area_names.join(", ")})</span>
            {!disabled && (
              <button type="button" onClick={() => removeArea(area.area_id)} className="ml-0.5 rounded-full p-0.5 hover:bg-muted">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
          </Badge>
        ))}
      </div>

      {!disabled && (
        <div className="space-y-2">
          <Select value={selectedAreaId} onValueChange={setSelectedAreaId}>
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue placeholder="Select area to expand..." />
            </SelectTrigger>
            <SelectContent>
              {DUMMY_AREAS.map((area) => (
                <SelectItem key={area.area_id} value={area.area_id}>{area.area_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedArea && (
            <div className="rounded-md border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{selectedArea.area_name} — Select Sub Areas</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedArea.sub_areas.map((sub) => (
                  <label key={sub.sub_area_id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={isSubAreaSelected(selectedArea.area_id, sub.sub_area_id)}
                      onCheckedChange={() => toggleSubArea(selectedArea.area_id, selectedArea.area_name, sub.sub_area_id, sub.sub_area_name)}
                    />
                    {sub.sub_area_name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
