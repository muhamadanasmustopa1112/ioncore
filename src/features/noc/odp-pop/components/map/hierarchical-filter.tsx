"use client";

import { useMemo } from "react";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DUMMY_POP_DATA } from "../../data/dummy-odp-pop";
import { DUMMY_OLT_DETAILS } from "../../data/dummy-olt-details";
import { DUMMY_ODP_LIST } from "../../data/dummy-odp-list";
import { MapPin, Building2, Radio } from "lucide-react";
import { PopResponse } from "../../types/pop";

interface HierarchicalFilterProps {
  popData?: PopResponse;
  value?: {
    area_id: string | null;
    pop_id: string | null;
    odp_id: string | null;
  };
  onFilterChange: (filters: {
    area_id: string | null;
    pop_id: string | null;
    odp_id: string | null;
  }) => void;
}

export function HierarchicalFilter({ onFilterChange, popData, value }: HierarchicalFilterProps) {
  const selectedArea = value?.area_id ?? null;
  const selectedPopId = value?.pop_id ?? null;
  const selectedOdpId = value?.odp_id ?? null;

  const { data: branches = [] } = useBranchList();
  const pops = useMemo(() => popData?.data || DUMMY_POP_DATA, [popData]);

  // 1. Area options from branches (value = branch.id)
  const areaOptions = useMemo(() => {
    if (branches.length > 0) {
      return branches
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((branch) => ({ value: branch.id, label: branch.name }));
    }
    const areas = Array.from(new Set(pops.map((p) => p.area).filter(Boolean)));
    return areas.sort().map((area) => ({ value: area, label: area }));
  }, [branches, pops]);

  // 2. Get POPs based on Area
  const popOptions = useMemo(() => {
    // If popData exists (from API), use all as API already filtered by area
    // If using dummy data, filter by area
    const isApiData = !!popData?.data;
    const filtered = (selectedArea && !isApiData)
      ? pops.filter((p) => p.area === selectedArea || p.branch?.id === selectedArea)
      : pops;
    return filtered.map((p) => ({ value: p.id, label: p.name }));
  }, [selectedArea, pops, popData]);

  // 3. Get ODPs based on POP
  const odpOptions = useMemo(() => {
    if (!selectedPopId) return [];
    const olts = DUMMY_OLT_DETAILS[selectedPopId] || [];
    const odps = olts.flatMap((olt) => DUMMY_ODP_LIST[olt.id] || []);
    return odps.map((o) => ({ value: o.id, label: o.name }));
  }, [selectedPopId]);

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
          onSelect={(val) =>
            onFilterChange({ area_id: val, pop_id: null, odp_id: null })
          }
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
          onSelect={(val) =>
            onFilterChange({ area_id: selectedArea, pop_id: val, odp_id: null })
          }
          placeholder="Select POP..."
          triggerClassName="rounded-2xl border-2 border-border/40 h-12 bg-background/80"
          disabled={!selectedArea && pops.length > 50}
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
          onSelect={(val) =>
            onFilterChange({ area_id: selectedArea, pop_id: selectedPopId, odp_id: val })
          }
          placeholder={selectedPopId ? "Select ODP..." : "Select POP first"}
          disabled={!selectedPopId}
          triggerClassName="rounded-2xl border-2 border-border/40 h-12 bg-background/80"
        />
      </div>
    </div>
  );
}
