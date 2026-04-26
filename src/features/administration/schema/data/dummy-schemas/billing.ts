import { SchemaRecord, BillingContent } from "../../types";

// ---------------------------------------------------------------------------
// Billing Schemas
// ---------------------------------------------------------------------------

const billingResidentialContent: BillingContent = {
  schema_name: "Billing Standard - Residential",
  customer_type: "residential",
  billing_cycle: {
    type: "monthly",
    anchor: "anniversary",
    day_of_month: 1,
    generate_days_before: 7,
    allow_partial_payments: false,
    payment_schedule: [],
  },
  otc: {
    type: "prepaid",
    invoice_trigger: "before_wo_dispatch",
    payment_required_before_wo: true,
    generate_faktur_pajak: false,
  },
  first_payment: {
    grace_period_days: 7,
    due_date_calculation: "invoice_date + 7 days",
    reminders: [
      { day: 3, channels: ["whatsapp"] },
      { day: 1, channels: ["whatsapp", "email"] },
    ],
    suspension_rule: {
      automatic: true,
      after_grace_period: true,
      requires_manual_approval: false,
      requires_executive_approval: false,
      notification: true,
    },
  },
  recurring_payment: {
    grace_period_days: 10,
    due_date_calculation: "invoice_date + 10 days",
    reminders: [
      { day: 7, channels: ["whatsapp"] },
      { day: 3, channels: ["whatsapp"] },
      { day: 1, channels: ["whatsapp", "email"] },
    ],
    late_fee: {
      enabled: true,
      type: "percentage",
      value: 2,
      apply_after_days: 10,
    },
    suspension_rule: {
      automatic: true,
      after_grace_period: true,
      requires_manual_approval: false,
      requires_executive_approval: false,
      notification: true,
    },
  },
  payment_terms: "net_7",
  payment_methods: ["bank_transfer", "virtual_account", "qris"],
  pricing_structure: {
    type: "flat_rate",
    base_price: "plan_price",
    volume_discount: { enabled: false, tiers: [] },
    annual_contract_discount: { enabled: false, discount_percentage: 0 },
    custom_discounts: { enabled: false },
    tax_included: false,
    tax_rate: 11,
  },
  invoice_format: {
    template: "standard_residential",
    items: [],
    currency: "IDR",
    show_payment_schedule: false,
  },
  contract: {
    lock_in_months: 12,
    early_termination_penalty: {
      enabled: true,
      type: "fixed_amount",
      value: 500000,
    },
    plan_downgrade: {
      requires_sales_manager_approval: false,
      effective: "next_billing_cycle",
    },
  },
};

const billingEnterpriseContent: BillingContent = {
  schema_name: "Billing Enterprise",
  customer_type: "enterprise",
  billing_cycle: {
    type: "monthly",
    anchor: "fixed_day",
    day_of_month: 1,
    generate_days_before: 14,
    allow_partial_payments: true,
    payment_schedule: [],
  },
  otc: {
    type: "postpaid",
    invoice_trigger: "after_noc_verification",
    payment_required_before_wo: false,
    generate_faktur_pajak: true,
  },
  first_payment: {
    grace_period_days: 14,
    due_date_calculation: "invoice_date + 14 days",
    reminders: [
      { day: 7, channels: ["email"] },
      { day: 3, channels: ["whatsapp", "email"] },
    ],
    suspension_rule: {
      automatic: false,
      after_grace_period: false,
      requires_manual_approval: true,
      requires_executive_approval: true,
      notification: true,
    },
  },
  recurring_payment: {
    grace_period_days: 30,
    due_date_calculation: "invoice_date + 30 days",
    reminders: [
      { day: 14, channels: ["email"] },
      { day: 7, channels: ["whatsapp", "email"] },
      { day: 3, channels: ["whatsapp", "email"] },
    ],
    late_fee: {
      enabled: true,
      type: "percentage",
      value: 1.5,
      apply_after_days: 30,
    },
    suspension_rule: {
      automatic: false,
      after_grace_period: false,
      requires_manual_approval: true,
      requires_executive_approval: true,
      notification: true,
    },
  },
  payment_terms: "net_30",
  payment_methods: ["bank_transfer", "virtual_account", "giro"],
  pricing_structure: {
    type: "negotiated",
    base_price: "negotiated",
    volume_discount: { enabled: true, tiers: [] },
    annual_contract_discount: { enabled: true, discount_percentage: 10 },
    custom_discounts: { enabled: true },
    tax_included: false,
    tax_rate: 11,
  },
  invoice_format: {
    template: "enterprise",
    items: [],
    currency: "IDR",
    show_payment_schedule: true,
  },
  contract: {
    lock_in_months: 24,
    early_termination_penalty: {
      enabled: true,
      type: "percentage_of_remaining",
      value: 20,
    },
    plan_downgrade: {
      requires_sales_manager_approval: true,
      effective: "next_billing_cycle",
    },
  },
};

export const BILLING_SCHEMAS: SchemaRecord[] = [
  {
    id: "schema-bil-001",
    schema_type: "billing",
    name: "Billing Standard - Residential",
    customer_type: "residential",
    latest_version: "v1.2",
    created_by: "user-001",
    updated_by: "user-002",
      schema_status: "published",
  },
  {
    id: "schema-bil-002",
    schema_type: "billing",
    name: "Billing Enterprise",
    customer_type: "enterprise",
    latest_version: "v1.0",
    created_by: "user-001",
    updated_by: "user-002",
      schema_status: "published",
  },
  {
    id: "schema-bil-003",
    schema_type: "billing",
    name: "Billing Standard - Residential v1.3",
    customer_type: "residential",
    latest_version: "v1.3",
    created_by: "user-001",
    updated_by: "user-001",
      schema_status: "published",
  },
];
