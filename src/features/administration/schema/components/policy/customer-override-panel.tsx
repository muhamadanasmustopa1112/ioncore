"use client";

import { useState } from "react";
import {
  RiAddLine,
  RiSearchLine,
  RiUserLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DUMMY_CUSTOMER_OVERRIDES } from "../../data/dummy-policies";
import { CustomerSchemaOverride, OverrideStatus } from "../../types/policy-types";

const STATUS_CONFIG: Record<OverrideStatus, { label: string; variant: "success" | "warning" | "destructive" }> = {
  active: { label: "Active", variant: "success" },
  pending_review: { label: "Pending Review", variant: "warning" },
  expired: { label: "Expired", variant: "destructive" },
};

const SCHEMA_TYPE_LABELS: Record<string, string> = {
  billing: "Billing",
  onboarding: "Onboarding",
  service: "Service",
  commission: "Commission",
  suspension: "Suspension",
};

function OverrideCard({ override }: { override: CustomerSchemaOverride }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[override.status];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between p-4 gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <RiUserLine className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{override.customer_name}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {override.customer_type}
              </Badge>
              <Badge
                variant={status.variant}
                appearance="light"
                className="text-[10px] px-1.5 py-0"
              >
                {status.label}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{SCHEMA_TYPE_LABELS[override.schema_type]} Schema</span>
              <RiArrowRightLine className="size-3" />
              <span className="font-medium text-foreground">{override.base_schema_name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{override.reason}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="info" appearance="light" className="text-xs">
            {override.overridden_fields.length} field{override.overridden_fields.length !== 1 ? "s" : ""}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-3"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Collapse" : "View"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Overridden Fields
          </p>
          <div className="space-y-2">
            {override.overridden_fields.map((field, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
              >
                <span className="text-xs font-mono text-muted-foreground truncate">
                  {field.field_path}
                </span>
                <span className="text-xs line-through text-muted-foreground">
                  {field.original_value}
                </span>
                <Badge variant="info" appearance="light" className="text-[11px] px-2">
                  {field.override_value}
                </Badge>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>Created by {override.created_by} · {new Date(override.created_at).toLocaleDateString()}</span>
            {override.approved_by && (
              <span>Approved by {override.approved_by}</span>
            )}
            {override.expires_at && (
              <span>Expires {new Date(override.expires_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomerOverridePanel() {
  const [search, setSearch] = useState("");

  const filtered = DUMMY_CUSTOMER_OVERRIDES.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_type.includes(q) ||
      o.schema_type.includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Individual schema attribute overrides for customers with negotiated or special contract terms.
        Overrides are applied on top of the customer&apos;s assigned base schema at runtime.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search customer or schema..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 font-medium w-full sm:w-auto">
          <RiAddLine className="size-4 mr-1.5" />
          New Override
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No overrides found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((override) => (
            <OverrideCard key={override.id} override={override} />
          ))}
        </div>
      )}
    </div>
  );
}
