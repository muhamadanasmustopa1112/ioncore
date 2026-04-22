"use client";

import { useMemo, useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";
import { DUMMY_OLT_DETAILS } from "../../data/dummy-olt-details";
import { DUMMY_ODP_LIST } from "../../data/dummy-odp-list";
import { MapPin, Building2, Radio } from "lucide-react";

interface HierarchicalFilterProps {
  onFilterChange: (filters: {
    area: string | null;
    popId: string | null;
    odpId: string | null;
  }) => void;
}

export function HierarchicalFilter({ onFilterChange }: HierarchicalFilterProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedPopId, setSelectedPopId] = useState<string | null>(null);
  const [selectedOdpId, setSelectedOdpId] = useState<string | null>(null);

  // 1. Get Unique Areas
  const areaOptions = useMemo(() => {
    const areas = Array.from(new Set(DUMMY_POP_DATA.map((p) => p.area)));
    return areas.sort().map((area) => ({ value: area, label: area }));
  }, []);

  // 2. Get POPs based on Area
  const popOptions = useMemo(() => {
    const filtered = selectedArea
      ? DUMMY_POP_DATA.filter((p) => p.area === selectedArea)
      : DUMMY_POP_DATA;
    return filtered.map((p) => ({ value: p.id, label: p.name }));
  }, [selectedArea]);

  // 3. Get ODPs based on POP
  const odpOptions = useMemo(() => {
    if (!selectedPopId) return [];
    const olts = DUMMY_OLT_DETAILS[selectedPopId] || [];
    const odps = olts.flatMap((olt) => DUMMY_ODP_LIST[olt.id] || []);
    return odps.map((o) => ({ value: o.id, label: o.name }));
  }, [selectedPopId]);

  // Notify parent of changes
  useEffect(() => {
    onFilterChange({
      area: selectedArea,
      popId: selectedPopId,
      odpId: selectedOdpId,
    });
  }, [selectedArea, selectedPopId, selectedOdpId, onFilterChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card/50 backdrop-blur-md p-6 rounded-3xl border-2 border-border/40 shadow-xl relative z-20">
      {/* Area Filter */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          <MapPin className="size-3 text-primary" /> Area
        </label>
        <SearchableSelect
          value={selectedArea || ""}
          options={areaOptions}
          onSelect={(val) => {
            setSelectedArea(val);
            setSelectedPopId(null);
            setSelectedOdpId(null);
          }}
          placeholder="Select Area..."
          triggerClassName="rounded-2xl border-2 border-border/40 h-12 bg-background/80"
        />
      </div>

      {/* POP Filter */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Building2 className="size-3 text-primary" /> POP
        </label>
        <SearchableSelect
          value={selectedPopId || ""}
          options={popOptions}
          onSelect={(val) => {
            setSelectedPopId(val);
            setSelectedOdpId(null);
          }}
          placeholder="Select POP..."
          triggerClassName="rounded-2xl border-2 border-border/40 h-12 bg-background/80"
          disabled={!selectedArea && DUMMY_POP_DATA.length > 50}
        />
      </div>

      {/* ODP Filter */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
          <Radio className="size-3 text-primary" /> ODP
        </label>
        <SearchableSelect
          value={selectedOdpId || ""}
          options={odpOptions}
          onSelect={(val) => setSelectedOdpId(val)}
          placeholder={selectedPopId ? "Select ODP..." : "Select POP first"}
          disabled={!selectedPopId}
          triggerClassName="rounded-2xl border-2 border-border/40 h-12 bg-background/80"
        />
      </div>
    </div>
  );
}
