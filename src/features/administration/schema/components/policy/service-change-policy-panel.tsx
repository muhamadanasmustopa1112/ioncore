"use client";

import { useState } from "react";
import {
  RiAddLine,
  RiEditLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiAlertLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DUMMY_CHANGE_POLICIES } from "../../data/dummy-policies";
import { ServiceChangePolicy, ChangeType } from "../../types/policy-types";
import { CustomerType } from "../../types";

const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  upgrade: "Plan Upgrade",
  downgrade: "Plan Downgrade",
  add_on: "Add-On",
  cancellation: "Cancellation",
  suspension_request: "Voluntary Suspension",
  relocation: "Relocation",
};

const CHANGE_TYPE_COLORS: Record<ChangeType, string> = {
  upgrade: "success",
  downgrade: "warning",
  add_on: "info",
  cancellation: "destructive",
  suspension_request: "warning",
  relocation: "info",
} as const;

const EFFECTIVE_LABELS: Record<string, string> = {
  immediate: "Immediate",
  next_billing_cycle: "Next Billing Cycle",
  custom_date: "Custom Date",
  requires_wo: "Requires WO",
};

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  residential: "Residential",
  business: "Business",
  enterprise: "Enterprise",
  corporate: "Corporate",
};

export function ServiceChangePolicyPanel() {
  const [policies] = useState(DUMMY_CHANGE_POLICIES);
  const [filterType, setFilterType] = useState<ChangeType | "all">("all");

  const filtered = filterType === "all"
    ? policies
    : policies.filter((p) => p.change_type === filterType);

  const changeTypes: (ChangeType | "all")[] = [
    "all", "upgrade", "downgrade", "add_on", "cancellation", "suspension_request", "relocation",
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Define approval requirements, effective date rules, and restrictions for each type of service
        change per customer type. These policies gate what actions sales and operations can perform.
      </p>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b overflow-x-auto">
        {changeTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={[
              "px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              filterType === type
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {type === "all" ? "All" : CHANGE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="sm" className="h-9 px-4 font-medium">
          <RiAddLine className="size-4 mr-1.5" />
          Add Policy
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No policies for this change type.
          </div>
        )}
      </div>
    </div>
  );
}

function PolicyCard({ policy }: { policy: ServiceChangePolicy }) {
  const changeColor = CHANGE_TYPE_COLORS[policy.change_type] as "success" | "warning" | "info" | "destructive";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{policy.policy_name}</span>
            <Badge variant={changeColor} appearance="light" className="text-[10px] px-2 py-0">
              {CHANGE_TYPE_LABELS[policy.change_type]}
            </Badge>
            <Badge variant="secondary" className="text-[10px] px-2 py-0">
              {CUSTOMER_TYPE_LABELS[policy.customer_type]}
            </Badge>
          </div>
          {policy.note && (
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <RiAlertLine className="size-3.5 mt-0.5 shrink-0 text-amber-500" />
              {policy.note}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs shrink-0">
          <RiEditLine className="size-3.5 mr-1" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PolicyMeta
          icon={<RiShieldCheckLine className="size-3.5 text-blue-500" />}
          label="Approval"
          value={
            policy.requires_approval
              ? policy.approval_roles.join(", ")
              : "Not required"
          }
          highlight={policy.requires_approval}
        />
        <PolicyMeta
          icon={<RiTimeLine className="size-3.5 text-purple-500" />}
          label="Effective Date"
          value={EFFECTIVE_LABELS[policy.effective_date_rule]}
        />
        <PolicyMeta
          label="During Contract"
          value={policy.allowed_during_contract ? "Allowed" : "Not allowed"}
          valueClass={policy.allowed_during_contract ? "text-green-600" : "text-red-500"}
        />
        <PolicyMeta
          label="Penalty"
          value={policy.penalty_applies ? "Applies" : "No penalty"}
          valueClass={policy.penalty_applies ? "text-amber-600" : "text-muted-foreground"}
        />
      </div>
    </div>
  );
}

function PolicyMeta({
  icon,
  label,
  value,
  highlight,
  valueClass,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={`text-xs font-medium ${highlight ? "text-foreground" : valueClass ?? "text-muted-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
