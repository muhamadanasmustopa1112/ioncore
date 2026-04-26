"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiInformationLine,
  RiPercentLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commissionFormSchema, type CommissionFormValues } from "../../../types/commission-schema";
import { useSchemaStore } from "../../../store/schema";
import { useCreateSchema, useUpdateSchemaContent, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { CommissionSplitsSection } from "./commission-splits-section";
import { ReferralSection } from "./referral-section";

const DEFAULT_COMMISSION: CommissionFormValues = {
  name: "",
  customer_type: "residential",
  commission_type: "percentage",
  commission_value: 10,
  calculation_base: "first_invoice_amount",
  payment_timing: "on_first_payment",
  assignment: {
    sales_person: 55,
    sales_manager_enabled: true,
    sales_manager_percentage: 5,
    sales_manager_level: "direct_manager",
    sales_branch: 15,
    infrastructure_branch_enabled: true,
    infrastructure_branch_percentage: 10,
  },
  recurring_enabled: false,
  referral_enabled: false,
};

export function CommissionForm() {
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter } = useSchemaStore();
  const isDetailMode = form === "details";
  const createSchema = useCreateSchema();
  const updateSchema = useUpdateSchemaContent();

  const rhfForm = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: DEFAULT_COMMISSION,
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = rhfForm;

  const commissionType = watch("commission_type");

  const { data: schemaDetail } = useSchema((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);
  const { data: schemaVersions } = useSchemaVersions((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);

  function fromApiContent(c: Record<string, unknown>): Partial<CommissionFormValues> {
    const rules = ((c.commission_rules as unknown[]) ?? [])[0] as Record<string, unknown> ?? {};
    const ca = (rules.commission_assignment ?? {}) as Record<string, unknown>;
    const sm = (ca.sales_manager ?? {}) as Record<string, unknown>;
    const ib = (ca.infrastructure_branch ?? {}) as Record<string, unknown>;
    const rc = (c.recurring_commission ?? {}) as Record<string, unknown>;
    const rf = (c.referral_commission ?? {}) as Record<string, unknown>;
    const rfCond = (rf.conditions ?? {}) as Record<string, unknown>;
    return {
      commission_type: rules.commission_type as CommissionFormValues["commission_type"],
      commission_value: rules.commission_value as number,
      calculation_base: rules.calculation_base as CommissionFormValues["calculation_base"],
      payment_timing: rules.payment_timing as CommissionFormValues["payment_timing"],
      assignment: {
        sales_person: ca.sales_person as number,
        sales_manager_enabled: sm.enabled as boolean,
        sales_manager_percentage: sm.percentage as number,
        sales_manager_level: sm.level as CommissionFormValues["assignment"]["sales_manager_level"],
        sales_branch: ca.sales_branch as number,
        infrastructure_branch_enabled: ib.enabled as boolean,
        infrastructure_branch_percentage: ib.percentage as number,
      },
      recurring_enabled: rc.enabled as boolean,
      recurring_type: rc.type as CommissionFormValues["recurring_type"],
      recurring_value: rc.value as number,
      referral_enabled: rf.enabled as boolean,
      referral_reward_type: rf.reward_type as CommissionFormValues["referral_reward_type"],
      referral_reward_value: rf.reward_value as number,
      referral_trigger: rf.trigger as CommissionFormValues["referral_trigger"],
      referral_min_plan_price: rfCond.min_plan_price as number,
      referral_referrer_must_be_active: rfCond.referrer_must_be_active as boolean,
      referral_disbursement: rf.disbursement as CommissionFormValues["referral_disbursement"],
    };
  }

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    const content = fromApiContent(raw);
    reset({
      ...DEFAULT_COMMISSION,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as CommissionFormValues["customer_type"],
      ...content,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  function toApiContent(values: CommissionFormValues) {
    const commissionAssignment = {
      sales_person: values.assignment.sales_person,
      sales_manager: {
        enabled: values.assignment.sales_manager_enabled,
        percentage: values.assignment.sales_manager_percentage,
        level: values.assignment.sales_manager_level,
      },
      sales_branch: values.assignment.sales_branch,
      infrastructure_branch: {
        enabled: values.assignment.infrastructure_branch_enabled,
        percentage: values.assignment.infrastructure_branch_percentage,
        applies_when: "cross_branch_only",
      },
      company: "remainder",
    };

    return {
      commission_rules: [
        {
          rule_id: 1,
          rule_name: "Standard Sales Commission",
          conditions: {
            sales_channel: [],
            service_plan_price_range: { min: 0, max: null },
            contract_type: [],
            contract_value: { min: 0 },
          },
          commission_type: values.commission_type,
          commission_value: values.commission_value,
          commission_tiers: [],
          commission_assignment: commissionAssignment,
          calculation_base: values.calculation_base,
          payment_timing: values.payment_timing,
        },
      ],
      recurring_commission: {
        enabled: values.recurring_enabled,
        type: values.recurring_type ?? "percentage",
        value: values.recurring_value ?? 0,
        commission_assignment: commissionAssignment,
        calculation_base: values.recurring_enabled ? "recurring_invoice_amount" : "",
        payment_timing: values.recurring_enabled ? "monthly" : "",
      },
      referral_commission: {
        enabled: values.referral_enabled,
        reward_type: values.referral_reward_type ?? "cash",
        reward_value_type: "fixed",
        reward_value: values.referral_reward_value ?? 0,
        trigger: values.referral_trigger ?? "on_first_payment",
        conditions: {
          min_plan_price: values.referral_min_plan_price ?? 0,
          referrer_must_be_active: values.referral_referrer_must_be_active ?? true,
        },
        disbursement: values.referral_disbursement ?? "bank_transfer",
      },
    };
  }

  function onSubmit(values: CommissionFormValues) {
    const { name, customer_type } = values;
    const content = toApiContent(values);
    if (form === "new" || form === "clone") {
      createSchema.mutate({ schema_type: activeSchemaType, name, customer_type, content });
    } else if (form === "edit" && selectedSchemaId) {
      updateSchema.mutate({ id: selectedSchemaId, payload: { content } });
    }
  }

  useEffect(() => {
    setFormSubmitter(handleSubmit(onSubmit));
    return () => setFormSubmitter(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectedSchemaId]);

  const commissionValueLabel =
    commissionType === "percentage"
      ? "Percentage (%)"
      : commissionType === "fixed_amount"
      ? "Fixed Amount (IDR)"
      : "Commission Value";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Basic Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Schema Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Residential Commission Schema"
                  disabled={isDetailMode}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Customer Type</Label>
                <Select
                  value={watch("customer_type")}
                  onValueChange={(v) =>
                    setValue("customer_type", v as CommissionFormValues["customer_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Commission Rule */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiPercentLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Commission Rule</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Commission Type</Label>
                <Select
                  value={commissionType}
                  onValueChange={(v) =>
                    setValue("commission_type", v as CommissionFormValues["commission_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{commissionValueLabel}</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={isDetailMode}
                  {...register("commission_value", { valueAsNumber: true })}
                />
                {errors.commission_value && (
                  <p className="text-xs text-red-500">{errors.commission_value.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Calculation Base</Label>
                <Select
                  value={watch("calculation_base")}
                  onValueChange={(v) =>
                    setValue("calculation_base", v as CommissionFormValues["calculation_base"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_invoice_amount">First Invoice Amount</SelectItem>
                    <SelectItem value="annual_contract_value">Annual Contract Value</SelectItem>
                    <SelectItem value="recurring_invoice_amount">Recurring Invoice Amount</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Payment Timing</Label>
                <Select
                  value={watch("payment_timing")}
                  onValueChange={(v) =>
                    setValue("payment_timing", v as CommissionFormValues["payment_timing"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_first_payment">On First Payment</SelectItem>
                    <SelectItem value="on_contract_signing">On Contract Signing</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <CommissionSplitsSection form={rhfForm} disabled={isDetailMode} />

          <ReferralSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
