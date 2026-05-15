"use client";

import { useState } from "react";
import {
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiGroupLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SchemaAssignmentRule } from "../../types/policy-types";
import { CustomerType, SchemaType } from "../../types";

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  residential: "Residential",
  business: "Business",
  enterprise: "Enterprise",
  corporate: "Corporate",
};

const CUSTOMER_TYPE_COLORS: Record<CustomerType, string> = {
  residential: "bg-blue-50 text-blue-700 border-blue-200",
  business: "bg-purple-50 text-purple-700 border-purple-200",
  enterprise: "bg-amber-50 text-amber-700 border-amber-200",
  corporate: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const SCHEMA_FIELDS: { key: keyof SchemaAssignmentRule; label: string; type: SchemaType }[] = [
  { key: "billing_schema_name", label: "Billing", type: "billing" },
  { key: "onboarding_schema_name", label: "Onboarding", type: "onboarding" },
  { key: "service_schema_name", label: "Service", type: "service" },
  { key: "commission_schema_name", label: "Commission", type: "commission" },
  { key: "suspension_schema_name", label: "Suspension", type: "suspension" },
];

export function AssignmentRulesPanel() {
  const [rules, setRules] = useState<SchemaAssignmentRule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<SchemaAssignmentRule | null>(null);

  const startEdit = (rule: SchemaAssignmentRule) => {
    setEditingId(rule.id);
    setEditDraft({ ...rule });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft) return;
    setRules((prev) => prev.map((r) => (r.id === editDraft.id ? editDraft : r)));
    setEditingId(null);
    setEditDraft(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Define which default schema set is automatically assigned to each customer type at onboarding.
            Each customer type must have one schema of every type assigned.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => {
          const isEditing = editingId === rule.id;
          const data = isEditing ? editDraft! : rule;

          return (
            <div key={rule.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b ${CUSTOMER_TYPE_COLORS[rule.customer_type]}`}>
                <div className="flex items-center gap-3">
                  <RiGroupLine className="size-4" />
                  <span className="font-semibold text-sm">
                    {CUSTOMER_TYPE_LABELS[rule.customer_type]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <span className="hidden sm:inline text-xs opacity-70">
                        Last updated by {rule.updated_by}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => startEdit(rule)}
                      >
                        <RiEditLine className="size-3.5 mr-1" />
                        Edit
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <Button variant="ghost" size="sm" className="h-7 px-3 text-xs" onClick={cancelEdit}>
                        <RiCloseLine className="size-3.5 mr-1" />
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" className="h-7 px-3 text-xs" onClick={saveEdit}>
                        <RiCheckLine className="size-3.5 mr-1" />
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Schema assignments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                {SCHEMA_FIELDS.map((field) => (
                  <div key={field.key} className="p-4 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {field.label}
                    </p>
                    {isEditing ? (
                      <input
                        className="w-full text-xs border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        value={data[field.key] as string}
                        onChange={(e) =>
                          setEditDraft((prev) =>
                            prev ? { ...prev, [field.key]: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-medium px-2 py-0.5 max-w-full truncate block w-fit"
                        title={data[field.key] as string}
                      >
                        {data[field.key] as string}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
