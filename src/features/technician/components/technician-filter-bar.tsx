"use client";

import { Filter } from "lucide-react";
import type { WorkOrderListParams, WorkOrderState, WorkOrderType } from "../types/technician-api";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useMemo } from "react";

interface Props {
  filters: WorkOrderListParams;
  onChange: (filters: WorkOrderListParams) => void;
  onApply: () => void;
  hideSubArea?: boolean;
}

const WO_STATES: { label: string; value: WorkOrderState | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Unassigned", value: "unassigned" },
  { label: "Assigned", value: "assigned" },
  { label: "Accepted", value: "accepted" },
  { label: "Dispatched", value: "dispatched" },
  { label: "In Progress", value: "in_progress" },
  { label: "Pending NOC", value: "pending_noc_verification" },
  { label: "Completed", value: "completed" },
  { label: "Rescheduled", value: "rescheduled" },
  { label: "Cancelled", value: "cancelled" },
];

const WO_TYPES: { label: string; value: WorkOrderType | "" }[] = [
  { label: "All Types", value: "" },
  { label: "New Install (Broadband)", value: "new_installation_broadband" },
  { label: "New Install (Enterprise)", value: "new_installation_enterprise" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Termination", value: "termination" },
];

const selectClass =
  "w-full bg-surface-variant dark:bg-slate-800 border border-outline text-slate-600 dark:text-slate-300 rounded text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer";

export function TechnicianFilterBar({ filters, onChange, onApply, hideSubArea }: Props) {
  const { data: branches } = useBranchList({ per_page: 500 });

  const branchOptions = useMemo(() => {
    const opts = (branches ?? []).map((b: any) => ({
      value: b.id,
      label: b.name,
    }));
    return [{ value: "", label: "All Sub Areas" }, ...opts];
  }, [branches]);

  return (
    <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded shadow-sm border border-outline mb-4 sm:mb-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideSubArea ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-3 sm:gap-4 items-end`}>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Date
          </label>
          <input
            type="date"
            className={selectClass}
            value={filters.date ?? ""}
            onChange={(e) =>
              onChange({ ...filters, date: e.target.value, page: 1 })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Status
          </label>
          <select
            className={selectClass}
            value={filters.state ?? ""}
            onChange={(e) =>
              onChange({ ...filters, state: e.target.value as WorkOrderState | "", page: 1 })
            }
          >
            {WO_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Order Type
          </label>
          <select
            className={selectClass}
            value={filters.type ?? ""}
            onChange={(e) =>
              onChange({ ...filters, type: e.target.value as WorkOrderType | "", page: 1 })
            }
          >
            {WO_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {!hideSubArea && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Sub Area
            </label>
            <SearchableSelect
              value={filters.branch_id ?? ""}
              options={branchOptions}
              placeholder="All Sub Areas"
              onSelect={(val) =>
                onChange({ ...filters, branch_id: val, page: 1 })
              }
              triggerClassName="bg-surface-variant dark:bg-slate-800 border-outline h-9"
            />
          </div>
        )}

        <div className={hideSubArea ? "sm:col-span-2 lg:col-span-1" : "lg:col-span-1"}>
          <button
            onClick={onApply}
            className="w-full bg-primary text-white font-semibold py-2 rounded text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Filter className="size-4" /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
