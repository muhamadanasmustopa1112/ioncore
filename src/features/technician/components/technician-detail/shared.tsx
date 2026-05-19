"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  WorkOrderState,
  WorkOrderType,
  WorkOrderPriority,
  ResolutionStatus,
  CustomerSignOffStatus,
  NOCApprovalDecision,
  BillingTriggerStatus,
} from "../../types/technician-api";

// ── Style maps ─────────────────────────────────────────────────────────────

export const STATE_VARIANT: Record<WorkOrderState, "primary" | "warning" | "success" | "destructive" | "info"> = {
  created: "info",
  unassigned: "warning",
  assigned: "info",
  accepted: "info",
  dispatched: "primary",
  in_progress: "primary",
  pending_noc_verification: "warning",
  completed: "success",
  rescheduled: "warning",
  cancelled: "destructive",
};

export const STATE_LABEL: Record<WorkOrderState, string> = {
  created: "Created",
  unassigned: "Unassigned",
  assigned: "Assigned",
  accepted: "Accepted",
  dispatched: "Dispatched",
  in_progress: "In Progress",
  pending_noc_verification: "Pending NOC",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

export const TYPE_LABEL: Record<WorkOrderType, string> = {
  new_installation_broadband: "New Installation (Broadband)",
  new_installation_enterprise: "New Installation (Enterprise)",
  maintenance: "Maintenance",
  termination: "Termination",
};

export const PRIORITY_VARIANT: Record<WorkOrderPriority, "primary" | "warning" | "destructive" | "info"> = {
  low: "info",
  medium: "primary",
  high: "warning",
  urgent: "destructive",
};

export const RESOLUTION_VARIANT: Record<ResolutionStatus, "info" | "primary" | "success" | "warning"> = {
  open: "info",
  in_progress: "primary",
  resolved: "success",
  deferred: "warning",
};

export const SIGNOFF_VARIANT: Record<CustomerSignOffStatus, "info" | "primary" | "success" | "destructive"> = {
  pending: "info",
  requested: "primary",
  confirmed: "success",
  expired: "destructive",
};

export const NOC_DECISION_VARIANT: Record<NOCApprovalDecision, "success" | "destructive" | "warning"> = {
  approved: "success",
  rejected: "destructive",
  redispatch: "warning",
};

export const BILLING_VARIANT: Record<BillingTriggerStatus, "info" | "success" | "warning"> = {
  pending: "info",
  triggered: "success",
  skipped: "warning",
};

// ── Utils ──────────────────────────────────────────────────────────────────

export function fmtDate(s: string | undefined | null) {
  if (!s) return "—";
  try {
    return format(new Date(s), "PP p");
  } catch {
    return s;
  }
}

export function humanize(s: string | undefined | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ");
}

export function formatResolutionTimeSpent(
  minutes?: number | null,
  hhMmSs?: string | null,
): string | null {
  const clock = hhMmSs?.trim();
  if (minutes != null && clock) return `${minutes} min (${clock})`;
  if (minutes != null) return `${minutes} min`;
  if (clock) return clock;
  return null;
}

export function hasResolutionTimeSpent(minutes?: number | null, hhMmSs?: string | null): boolean {
  return minutes != null || Boolean(hhMmSs?.trim());
}

// ── Layout primitives ──────────────────────────────────────────────────────

export function SectionCard({
  icon: Icon,
  title,
  children,
  tone,
  headerClass,
  rightSlot,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "rose" | "amber" | "emerald";
  headerClass?: string;
  rightSlot?: React.ReactNode;
}) {
  const toneClass =
    tone === "rose" ? "border-l-4 border-rose-500"
    : tone === "amber" ? "border-l-4 border-amber-500"
    : tone === "emerald" ? "border-l-4 border-emerald-500"
    : "";
  return (
    <Card className={toneClass}>
      <CardHeader className={`bg-slate-50/50 dark:bg-slate-800/50 border-b ${headerClass ?? ""}`}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Icon className="size-4 text-primary" /> {title}
          </CardTitle>
          {rightSlot}
        </div>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

export function Field({
  label,
  value,
  className,
  capitalize,
}: {
  label: string;
  value: string | number | undefined | null;
  className?: string;
  capitalize?: boolean;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
      <p className={`text-sm font-semibold break-words ${capitalize ? "capitalize" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-right font-semibold text-sm ${valueClass ?? ""}`}>{value || "—"}</span>
    </div>
  );
}

export function SpecCell({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs sm:text-sm font-bold break-words">{value || "—"}</p>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-400 italic">{children}</p>;
}
