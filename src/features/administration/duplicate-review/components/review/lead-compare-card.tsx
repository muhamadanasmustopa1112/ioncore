"use client";

import { RiStarLine } from "@remixicon/react";
import type { DuplicateLeadSnapshot, MatchReason } from "../../types/duplicate-review";

interface Props {
  lead: DuplicateLeadSnapshot;
  label: string;
  isMaster: boolean;
  matchReasons: MatchReason[];
}

const fieldHighlight = (
  field: MatchReason,
  matchReasons: MatchReason[]
): string =>
  matchReasons.includes(field)
    ? "bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 rounded px-1"
    : "";

export function LeadCompareCard({ lead, label, isMaster, matchReasons }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 space-y-3 transition-colors ${
        isMaster
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {isMaster && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <RiStarLine className="size-3" />
            Master
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Name" value={lead.lead_name} highlight={fieldHighlight("name", matchReasons)} />
        <Row label="Type" value={`${lead.lead_type} / ${lead.customer_sub_type}`} />
        <Row label="Source" value={lead.source} />
        <Row label="Status" value={lead.status} />
        <Row label="Branch" value={lead.branch_name} />
        <Row label="Sales Rep" value={lead.assigned_sales_name} />
        {lead.phone && (
          <Row label="Phone" value={lead.phone} highlight={fieldHighlight("phone", matchReasons)} />
        )}
        {lead.email && (
          <Row label="Email" value={lead.email} highlight={fieldHighlight("email", matchReasons)} />
        )}
        {lead.address && (
          <Row label="Address" value={lead.address} highlight={fieldHighlight("address", matchReasons)} />
        )}
        <Row
          label="Created"
          value={new Date(lead.created_at).toLocaleDateString("id-ID")}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = "",
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div className="flex gap-2">
      <span className="w-20 shrink-0 text-[11px] font-medium text-muted-foreground">{label}</span>
      <span className={`flex-1 text-xs break-words ${highlight}`}>{value}</span>
    </div>
  );
}
