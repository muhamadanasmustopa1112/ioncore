import { SchemaRecord, CommissionContent } from "../../types";

// ---------------------------------------------------------------------------
// Commission Schemas
// ---------------------------------------------------------------------------

const commissionResidentialContent: CommissionContent = {
  schema_name: "Commission Standard",
  customer_type: "residential",
  commission_rules: [
    {
      rule_id: 1,
      rule_name: "Standard Commission",
      conditions: {
        sales_channel: ["direct"],
        service_plan_price_range: { min: 0, max: null },
        contract_type: ["monthly"],
        contract_value: { min: 0 },
      },
      commission_type: "percentage",
      commission_value: 10,
      commission_tiers: [],
      commission_assignment: {
        sales_person: 55,
        sales_manager: { enabled: true, percentage: 5, level: "direct_manager" },
        sales_branch: 15,
        infrastructure_branch: { enabled: true, percentage: 10, applies_when: "cross_branch_only" },
        company: "remainder",
      },
      calculation_base: "first_invoice_amount",
      payment_timing: "on_first_payment",
    },
  ],
  recurring_commission: {
    enabled: false,
    type: "percentage",
    value: 0,
    commission_assignment: {
      sales_person: 0,
      sales_manager: { enabled: false, percentage: 0, level: "direct_manager" },
      sales_branch: 0,
      infrastructure_branch: { enabled: false, percentage: 0, applies_when: "cross_branch_only" },
      company: "remainder",
    },
    calculation_base: "",
    payment_timing: "",
  },
  referral_commission: {
    enabled: true,
    reward_type: "account_credit",
    reward_value_type: "fixed",
    reward_value: 100000,
    trigger: "on_first_payment",
    conditions: { min_plan_price: 0, referrer_must_be_active: true },
    disbursement: "account_credit",
  },
};

const commissionEnterpriseContent: CommissionContent = {
  schema_name: "Commission Enterprise",
  customer_type: "enterprise",
  commission_rules: [
    {
      rule_id: 1,
      rule_name: "Enterprise Commission - Annual",
      conditions: {
        sales_channel: ["direct", "reseller"],
        service_plan_price_range: { min: 5000000, max: null },
        contract_type: ["annual"],
        contract_value: { min: 60000000 },
      },
      commission_type: "tiered",
      commission_value: 0,
      commission_tiers: [
        { min_amount: 0, max_amount: 100000000, percentage: 8 },
        { min_amount: 100000000, max_amount: 500000000, percentage: 10 },
        { min_amount: 500000000, max_amount: null, percentage: 12 },
      ],
      commission_assignment: {
        sales_person: 50,
        sales_manager: { enabled: true, percentage: 10, level: "direct_manager+area_manager" },
        sales_branch: 20,
        infrastructure_branch: { enabled: true, percentage: 10, applies_when: "cross_branch_only" },
        company: "remainder",
      },
      calculation_base: "annual_contract_value",
      payment_timing: "on_contract_signing",
    },
  ],
  recurring_commission: {
    enabled: true,
    type: "percentage",
    value: 2,
    commission_assignment: {
      sales_person: 60,
      sales_manager: { enabled: true, percentage: 10, level: "direct_manager" },
      sales_branch: 20,
      infrastructure_branch: { enabled: false, percentage: 0, applies_when: "cross_branch_only" },
      company: "remainder",
    },
    calculation_base: "recurring_invoice_amount",
    payment_timing: "monthly",
  },
  referral_commission: {
    enabled: false,
    reward_type: "cash",
    reward_value_type: "fixed",
    reward_value: 0,
    trigger: "on_first_payment",
    conditions: { min_plan_price: 0, referrer_must_be_active: true },
    disbursement: "bank_transfer",
  },
};

export const COMMISSION_SCHEMAS: SchemaRecord[] = [
  {
    id: "schema-com-001",
    schema_type: "commission",
    name: "Commission Standard",
    customer_type: "residential",
    version: "1.0",
    status: "published",
    content: commissionResidentialContent,
    change_reason: "Initial release",
    created_by: "user-001",
    published_by: "user-002",
    published_at: "2026-01-15T08:00:00Z",
    created_at: "2026-01-10T07:00:00Z",
    updated_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "schema-com-002",
    schema_type: "commission",
    name: "Commission Enterprise",
    customer_type: "enterprise",
    version: "1.0",
    status: "approved",
    content: commissionEnterpriseContent,
    change_reason: "Struktur komisi enterprise dengan tier bertingkat",
    created_by: "user-003",
    created_at: "2026-04-01T09:00:00Z",
    updated_at: "2026-04-10T11:00:00Z",
  },
];
