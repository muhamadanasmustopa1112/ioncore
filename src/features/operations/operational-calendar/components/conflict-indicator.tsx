"use client";

import { TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CalendarConflict } from "../types";

const CONFLICT_TYPE_LABELS: Record<string, string> = {
  overlapping_maintenance: "Overlapping Maintenance",
  billing_cutoff: "Billing Cutoff Conflict",
  stock_opname: "Stock Opname Conflict",
};

const SEVERITY_CLASSES: Record<"low" | "medium" | "high", string> = {
  low: "text-yellow-500 dark:text-yellow-400",
  medium: "text-orange-500 dark:text-orange-400",
  high: "text-red-500 dark:text-red-400",
};

interface ConflictIndicatorProps {
  conflicts: CalendarConflict[];
}

export function ConflictIndicator({ conflicts }: ConflictIndicatorProps) {
  if (!conflicts.length) return null;

  const severityOrder = { low: 0, medium: 1, high: 2 } as const;
  type Severity = keyof typeof severityOrder;

  const highestSeverity = conflicts.reduce<Severity>((acc, c) => {
    return severityOrder[c.severity as Severity] > severityOrder[acc] ? c.severity as Severity : acc;
  }, "low");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1 cursor-help ${SEVERITY_CLASSES[highestSeverity]}`}
        >
          <TriangleAlert className="size-3.5" />
          <span className="text-[10px] font-semibold">{conflicts.length}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-72 p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground">
          {conflicts.length} Conflict{conflicts.length > 1 ? "s" : ""} Detected
        </p>
        <div className="space-y-1.5">
          {conflicts.map((conflict) => (
            <div
              key={conflict.conflicting_event_id}
              className="rounded bg-muted/50 p-1.5 text-[11px] leading-tight"
            >
              <p className="font-medium text-foreground">
                {CONFLICT_TYPE_LABELS[conflict.conflict_type] ??
                  conflict.conflict_type}
              </p>
              <p className="text-muted-foreground mt-0.5">
                vs. {conflict.conflicting_event_title}
              </p>
              <p className="text-muted-foreground">
                {new Date(conflict.conflicting_event_date).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
