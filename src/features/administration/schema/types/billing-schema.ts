import { z } from "zod";

export interface LateFee {
  enabled: boolean;
  type: "percentage" | "fixed_amount";
  value: number;
  apply_after_days: number;
}

export interface SuspensionRule {
  automatic: boolean;
  after_grace_period: boolean;
  requires_manual_approval?: boolean;
  requires_executive_approval?: boolean;
  notification: boolean;
}

export interface BillingContent {
  schema_name: string;
  customer_type: string;
  billing_cycle: {
    type: "monthly" | "quarterly" | "annual";
    anchor: "anniversary" | "fixed_day";
    day_of_month: number;
    generate_days_before: number;
    allow_partial_payments: boolean;
    payment_schedule: unknown[];
  };
  otc: {
    type: "free" | "prepaid" | "postpaid";
    invoice_trigger: "before_wo_dispatch" | "after_noc_verification" | "none";
    payment_required_before_wo: boolean;
    generate_faktur_pajak: boolean;
  };
  first_payment: {
    grace_period_days: number;
    due_date_calculation: string;
    reminders: Array<{ day: number; channels: string[] }>;
    suspension_rule: SuspensionRule;
  };
  recurring_payment: {
    grace_period_days: number;
    due_date_calculation: string;
    reminders: Array<{ day: number; channels: string[] }>;
    late_fee: LateFee;
    suspension_rule: SuspensionRule;
  };
  payment_terms: "net_7" | "net_15" | "net_30" | "net_45";
  payment_methods: string[];
  pricing_structure: {
    type: "flat_rate" | "negotiated";
    base_price: string;
    volume_discount: { enabled: boolean; tiers: unknown[] };
    annual_contract_discount: { enabled: boolean; discount_percentage: number };
    custom_discounts: { enabled: boolean };
    tax_included: boolean;
    tax_rate: number;
  };
  invoice_format: {
    template: string;
    items: unknown[];
    currency: string;
    show_payment_schedule: boolean;
  };
  contract: {
    lock_in_months: number;
    early_termination_penalty: {
      enabled: boolean;
      type: "fixed_amount" | "percentage_of_remaining";
      value: number;
    };
    plan_downgrade: {
      requires_sales_manager_approval: boolean;
      effective: "next_billing_cycle" | "immediate";
    };
  };
}

export const billingFormSchema = z.object({
  name: z.string().min(3, "Schema name min 3 characters"),
  customer_type: z.string().min(1, "Customer type is required"),
  billing_cycle: z.object({
    type: z.enum(["monthly", "quarterly", "annual"]),
    anchor: z.enum(["anniversary", "fixed_day"]),
    day_of_month: z.number().int().min(1).max(31),
    generate_days_before: z.number().int().min(1).max(30),
    allow_partial_payments: z.boolean(),
  }),
  otc: z.object({
    type: z.enum(["free", "prepaid", "postpaid"]),
    invoice_trigger: z.enum(["before_wo_dispatch", "after_noc_verification", "none"]),
    payment_required_before_wo: z.boolean(),
    generate_faktur_pajak: z.boolean(),
  }),
  first_payment: z.object({
    grace_period_days: z.number().int().min(0),
    suspension_automatic: z.boolean(),
    suspension_notification: z.boolean(),
  }),
  recurring_payment: z.object({
    grace_period_days: z.number().int().min(0),
    late_fee_enabled: z.boolean(),
    late_fee_type: z.enum(["percentage", "fixed_amount"]).optional(),
    late_fee_value: z.number().min(0).optional(),
    late_fee_apply_after_days: z.number().int().min(0).optional(),
    suspension_automatic: z.boolean(),
    suspension_requires_manual_approval: z.boolean(),
    suspension_requires_executive_approval: z.boolean(),
  }),
  payment_terms: z.enum(["net_7", "net_15", "net_30", "net_45"]),
  payment_methods: z.array(z.string()).min(1, "At least 1 payment method required"),
  pricing_type: z.enum(["flat_rate", "negotiated"]),
  tax_included: z.boolean(),
  tax_rate: z.number().min(0).max(100),
  contract_lock_in_months: z.number().int().min(0),
  early_termination_enabled: z.boolean(),
  early_termination_type: z.enum(["fixed_amount", "percentage_of_remaining"]).optional(),
  early_termination_value: z.number().min(0).optional(),
});

export type BillingFormValues = z.infer<typeof billingFormSchema>;
