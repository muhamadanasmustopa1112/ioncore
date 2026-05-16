import { z } from "zod";

export interface CommissionTier {
  min_amount: number;
  max_amount: number | null;
  percentage: number;
}

export interface CommissionAssignment {
  sales_person: number;
  sales_manager: {
    enabled: boolean;
    percentage: number;
    level: "direct_manager" | "direct_manager+area_manager";
  };
  sales_branch: number;
  infrastructure_branch: {
    enabled: boolean;
    percentage: number;
    applies_when: "cross_branch_only" | "always";
  };
  company: "remainder";
}

export interface CommissionRule {
  rule_id: number;
  rule_name: string;
  conditions: {
    sales_channel: string[];
    service_plan_price_range: { min: number; max: number | null };
    contract_type: string[];
    contract_value: { min: number };
  };
  commission_type: "percentage" | "fixed_amount" | "tiered";
  commission_value: number;
  commission_tiers: CommissionTier[];
  commission_assignment: CommissionAssignment;
  calculation_base: "first_invoice_amount" | "annual_contract_value" | "recurring_invoice_amount" | "fixed";
  payment_timing: "on_first_payment" | "on_contract_signing" | "monthly" | "quarterly";
}

export interface CommissionContent {
  schema_name: string;
  customer_type: string;
  commission_rules: CommissionRule[];
  recurring_commission: {
    enabled: boolean;
    type: "percentage" | "fixed_amount";
    value: number;
    commission_assignment: CommissionAssignment;
    calculation_base: string;
    payment_timing: string;
  };
  referral_commission: {
    enabled: boolean;
    reward_type: "cash" | "account_credit" | "voucher";
    reward_value_type: "fixed" | "percentage";
    reward_value: number;
    trigger: "on_first_payment" | "on_activation";
    conditions: {
      min_plan_price: number;
      referrer_must_be_active: boolean;
    };
    disbursement: "account_credit" | "bank_transfer" | "voucher_code";
  };
}

// Zod: commission splits must sum <= 100%
export const commissionAssignmentSchema = z.object({
  sales_person: z.number().min(0).max(100),
  sales_manager_enabled: z.boolean(),
  sales_manager_percentage: z.number().min(0).max(100),
  sales_manager_level: z.enum(["direct_manager", "direct_manager+area_manager"]),
  sales_branch: z.number().min(0).max(100),
  infrastructure_branch_enabled: z.boolean(),
  infrastructure_branch_percentage: z.number().min(0).max(100),
}).refine(
  (data) => {
    const total =
      data.sales_person +
      (data.sales_manager_enabled ? data.sales_manager_percentage : 0) +
      data.sales_branch +
      (data.infrastructure_branch_enabled ? data.infrastructure_branch_percentage : 0);
    return total <= 100;
  },
  { message: "Total commission splits must not exceed 100%" }
);

export const commissionFormSchema = z.object({
  name: z.string().min(3),
  customer_type: z.string().min(1, "Customer type is required"),
  commission_type: z.enum(["percentage", "fixed_amount", "tiered"]),
  commission_value: z.number().min(0),
  calculation_base: z.enum(["first_invoice_amount", "annual_contract_value", "recurring_invoice_amount", "fixed"]),
  payment_timing: z.enum(["on_first_payment", "on_contract_signing", "monthly", "quarterly"]),
  assignment: commissionAssignmentSchema,
  recurring_enabled: z.boolean(),
  recurring_type: z.enum(["percentage", "fixed_amount"]).optional(),
  recurring_value: z.number().min(0).optional(),
  referral_enabled: z.boolean(),
  referral_reward_type: z.enum(["cash", "account_credit", "voucher"]).optional(),
  referral_reward_value: z.number().min(0).optional(),
  referral_trigger: z.enum(["on_first_payment", "on_activation"]).optional(),
  referral_disbursement: z.enum(["account_credit", "bank_transfer", "voucher_code"]).optional(),
  referral_min_plan_price: z.number().min(0).optional(),
  referral_referrer_must_be_active: z.boolean().optional(),
});

export type CommissionFormValues = z.infer<typeof commissionFormSchema>;
