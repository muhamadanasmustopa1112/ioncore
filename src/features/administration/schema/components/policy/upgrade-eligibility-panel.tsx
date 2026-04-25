"use client";

import { useState } from "react";
import {
  RiAddLine,
  RiEditLine,
  RiArrowUpLine,
  RiTimeLine,
  RiCheckboxCircleLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DUMMY_UPGRADE_RULES } from "../../data/dummy-policies";
import { UpgradeEligibilityRule, PaymentHistoryRequirement } from "../../types/policy-types";
import { CustomerType } from "../../types";

const PAYMENT_HISTORY_LABELS: Record<PaymentHistoryRequirement, { label: string; color: string }> = {
  no_restriction: { label: "No Restriction", color: "text-muted-foreground" },
  no_overdue: { label: "No Overdue", color: "text-blue-600" },
  no_overdue_3m: { label: "No Overdue (3 months)", color: "text-amber-600" },
  no_overdue_6m: { label: "No Overdue (6 months)", color: "text-orange-600" },
};

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  residential: "Residential",
  business: "Business",
  enterprise: "Enterprise",
  corporate: "Corporate",
};

const CUSTOMER_TYPE_VARIANTS = {
  residential: "info",
  business: "warning",
  enterprise: "success",
  corporate: "destructive",
} as const;

export function UpgradeEligibilityPanel() {
  const [rules, setRules] = useState(DUMMY_UPGRADE_RULES);

  const toggleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Rules that determine when a customer is eligible to upgrade their service package.
        Each rule defines the minimum subscription duration, payment history, and approval
        requirements for a specific package tier transition.
      </p>

      <div className="flex justify-end">
        <Button variant="primary" size="sm" className="h-9 px-4 font-medium">
          <RiAddLine className="size-4 mr-1.5" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} onToggle={toggleActive} />
        ))}
      </div>
    </div>
  );
}

function RuleCard({
  rule,
  onToggle,
}: {
  rule: UpgradeEligibilityRule;
  onToggle: (id: string) => void;
}) {
  const paymentConfig = PAYMENT_HISTORY_LABELS[rule.payment_history];

  return (
    <div className={`rounded-xl border bg-card overflow-hidden transition-opacity ${!rule.active ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-medium">
            <RiArrowUpLine className="size-4 text-emerald-500" />
            {rule.rule_name}
          </div>
          <Badge
            variant={CUSTOMER_TYPE_VARIANTS[rule.customer_type as keyof typeof CUSTOMER_TYPE_VARIANTS] ?? "info"}
            appearance="light"
            className="text-[10px] px-2 py-0"
          >
            {CUSTOMER_TYPE_LABELS[rule.customer_type as keyof typeof CUSTOMER_TYPE_LABELS] ?? rule.customer_type}
          </Badge>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {rule.active ? "Active" : "Inactive"}
          </span>
          <Switch
            size="sm"
            checked={rule.active}
            onCheckedChange={() => onToggle(rule.id)}
          />
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs">
            <RiEditLine className="size-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Tier transition */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs px-2.5 py-1 font-mono">
            {rule.from_tier}
          </Badge>
          <RiArrowUpLine className="size-4 text-emerald-500" />
          <Badge variant="success" appearance="light" className="text-xs px-2.5 py-1 font-mono">
            {rule.to_tier}
          </Badge>
        </div>

        {/* Requirements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <RiTimeLine className="size-3.5 text-blue-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Min. Subscription
              </span>
            </div>
            <p className="text-sm font-semibold">
              {rule.min_subscription_months === 0
                ? "None"
                : `${rule.min_subscription_months} month${rule.min_subscription_months > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <RiCheckboxCircleLine className="size-3.5 text-purple-500" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Payment History
              </span>
            </div>
            <p className={`text-sm font-semibold ${paymentConfig.color}`}>
              {paymentConfig.label}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block">
              Approval Required
            </span>
            <Badge
              variant={rule.requires_approval ? "warning" : "success"}
              appearance="light"
              className="text-xs px-2"
            >
              {rule.requires_approval ? "Yes" : "No"}
            </Badge>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block">
              Cooldown Period
            </span>
            <p className="text-sm font-semibold">
              {rule.cooldown_days === 0 ? "None" : `${rule.cooldown_days} days`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
