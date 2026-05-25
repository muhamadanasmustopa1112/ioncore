"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationLine } from "@remixicon/react";
import { toast } from "sonner";
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
import { billingFormSchema, type BillingFormValues } from "../../../types/billing-schema";
import { useSchemaStore } from "../../../store/schema";
import { useCreateSchema, useEditSchema, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { useActiveCustomerTypes } from "@/features/administration/customer-types/api/customer-types-queries";
import { useUpdateCustomerSchema } from "@/features/rule-schema";
import { OverrideDiffProvider } from "../override-diff";
import { computeOverrideChanges } from "../../../utils/override-changes";
import { BillingCycleSection } from "./billing-cycle-section";
import { OtcSection } from "./otc-section";
import { PaymentSection } from "./payment-section";
import { PricingContractSection } from "./pricing-contract-section";

const DEFAULT_BILLING: BillingFormValues = {
  name: "",
  customer_type: "broadband",
  billing_cycle: {
    type: "monthly",
    anchor: "anniversary",
    day_of_month: 1,
    generate_days_before: 3,
    allow_partial_payments: false,
  },
  otc: {
    type: "prepaid",
    invoice_trigger: "before_wo_dispatch",
    payment_required_before_wo: true,
    generate_faktur_pajak: true,
  },
  first_payment: {
    grace_period_days: 3,
    suspension_automatic: false,
    suspension_notification: true,
  },
  recurring_payment: {
    grace_period_days: 7,
    late_fee_enabled: false,
    suspension_automatic: false,
    suspension_requires_manual_approval: false,
    suspension_requires_executive_approval: false,
  },
  payment_terms: "net_7",
  payment_methods: ["bank_transfer"],
  pricing_type: "flat_rate",
  tax_included: false,
  tax_rate: 11,
  contract_lock_in_months: 12,
  early_termination_enabled: false,
};

export function BillingForm() {
  const { t } = useTranslation();
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter, setSheetLoading, overrideCustomerSchema, closeSchemaSheet, openOverrideConfirm, overrideConfirmTrigger } = useSchemaStore();
  const isDetailMode = form === "details" || form === "view_override";
  const isOverride = form === "override" || form === "view_override";
  const createSchema = useCreateSchema();
  const editSchema = useEditSchema();
  const updateCustomerSchema = useUpdateCustomerSchema();

  const rhfForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: DEFAULT_BILLING,
  });

  const { register, watch, setValue, handleSubmit, reset, getValues, formState: { errors } } = rhfForm;

  const needsData = form === "edit" || form === "details" || form === "clone";
  const { data: schemaDetail, isLoading: isSchemaLoading } = useSchema(needsData ? selectedSchemaId : null);
  const { data: schemaVersions, isLoading: isVersionsLoading } = useSchemaVersions(needsData ? selectedSchemaId : null);
  const isLoadingData = needsData && (isSchemaLoading || isVersionsLoading);
  const { data: customerTypes = [] } = useActiveCustomerTypes();

  useEffect(() => {
    setSheetLoading(isLoadingData);
    return () => setSheetLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData]);

  function fromApiContent(c: Record<string, unknown>): Partial<BillingFormValues> {
    const fp = (c.first_payment ?? {}) as Record<string, unknown>;
    const sr = (fp.suspension_rule ?? {}) as Record<string, unknown>;
    const rp = (c.recurring_payment ?? {}) as Record<string, unknown>;
    const rsr = (rp.suspension_rule ?? {}) as Record<string, unknown>;
    const lf = (rp.late_fee ?? {}) as Record<string, unknown>;
    const ps = (c.pricing_structure ?? {}) as Record<string, unknown>;
    const ct = (c.contract ?? {}) as Record<string, unknown>;
    const etp = (ct.early_termination_penalty ?? {}) as Record<string, unknown>;
    return {
      billing_cycle: c.billing_cycle as BillingFormValues["billing_cycle"],
      otc: c.otc as BillingFormValues["otc"],
      first_payment: {
        grace_period_days: (fp.grace_period_days as number) ?? DEFAULT_BILLING.first_payment.grace_period_days,
        suspension_automatic: (sr.automatic as boolean) ?? DEFAULT_BILLING.first_payment.suspension_automatic,
        suspension_notification: (sr.notification as boolean) ?? DEFAULT_BILLING.first_payment.suspension_notification,
      },
      recurring_payment: {
        grace_period_days: (rp.grace_period_days as number) ?? DEFAULT_BILLING.recurring_payment.grace_period_days,
        late_fee_enabled: (lf.enabled as boolean) ?? DEFAULT_BILLING.recurring_payment.late_fee_enabled,
        late_fee_type: lf.type as BillingFormValues["recurring_payment"]["late_fee_type"],
        late_fee_value: lf.value as number,
        late_fee_apply_after_days: lf.apply_after_days as number,
        suspension_automatic: (rsr.automatic as boolean) ?? DEFAULT_BILLING.recurring_payment.suspension_automatic,
        suspension_requires_manual_approval: (rsr.requires_manual_approval as boolean) ?? DEFAULT_BILLING.recurring_payment.suspension_requires_manual_approval,
        suspension_requires_executive_approval: (rsr.requires_executive_approval as boolean) ?? DEFAULT_BILLING.recurring_payment.suspension_requires_executive_approval,
      },
      payment_terms: c.payment_terms as BillingFormValues["payment_terms"],
      payment_methods: c.payment_methods as string[],
      pricing_type: ps.type as BillingFormValues["pricing_type"],
      tax_included: ps.tax_included as boolean,
      tax_rate: ps.tax_rate as number,
      contract_lock_in_months: ct.lock_in_months as number,
      early_termination_enabled: etp.enabled as boolean,
      early_termination_type: etp.type as BillingFormValues["early_termination_type"],
      early_termination_value: etp.value as number,
    };
  }

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    const content = fromApiContent(raw);
    reset({
      ...DEFAULT_BILLING,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as BillingFormValues["customer_type"],
      ...content,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  const [overrideSnapshot, setOverrideSnapshot] = useState<BillingFormValues>(DEFAULT_BILLING);
  const pendingOverrideContent = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!isOverride || !overrideCustomerSchema) return;
    const partial = fromApiContent(overrideCustomerSchema.overridden_content);
    const cleaned = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<BillingFormValues>;
    const vals: BillingFormValues = { ...DEFAULT_BILLING, ...cleaned, name: overrideCustomerSchema.schema_name ?? "_override" };
    reset(vals);
    setOverrideSnapshot(vals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverride, overrideCustomerSchema?.id]);

  function toApiContent(values: BillingFormValues) {
    return {
      billing_cycle: values.billing_cycle,
      otc: values.otc,
      first_payment: {
        grace_period_days: values.first_payment.grace_period_days,
        due_date_calculation: "",
        reminders: [],
        suspension_rule: {
          automatic: values.first_payment.suspension_automatic,
          after_grace_period: values.first_payment.suspension_automatic,
          notification: values.first_payment.suspension_notification,
        },
      },
      recurring_payment: {
        grace_period_days: values.recurring_payment.grace_period_days,
        due_date_calculation: "",
        reminders: [],
        late_fee: {
          enabled: values.recurring_payment.late_fee_enabled,
          type: values.recurring_payment.late_fee_type ?? "percentage",
          value: values.recurring_payment.late_fee_value ?? 0,
          apply_after_days: values.recurring_payment.late_fee_apply_after_days ?? 0,
        },
        suspension_rule: {
          automatic: values.recurring_payment.suspension_automatic,
          after_grace_period: values.recurring_payment.suspension_automatic,
          requires_manual_approval: values.recurring_payment.suspension_requires_manual_approval,
          requires_executive_approval: values.recurring_payment.suspension_requires_executive_approval,
          notification: true,
        },
      },
      payment_terms: values.payment_terms,
      payment_methods: values.payment_methods,
      pricing_structure: {
        type: values.pricing_type,
        base_price: "",
        volume_discount: { enabled: false, tiers: [] },
        annual_contract_discount: { enabled: false, discount_percentage: 0 },
        custom_discounts: { enabled: false },
        tax_included: values.tax_included,
        tax_rate: values.tax_rate,
      },
      invoice_format: {
        template: "",
        items: [],
        currency: "IDR",
        show_payment_schedule: false,
      },
      contract: {
        lock_in_months: values.contract_lock_in_months,
        early_termination_penalty: {
          enabled: values.early_termination_enabled,
          type: values.early_termination_type ?? "fixed_amount",
          value: values.early_termination_value ?? 0,
        },
        plan_downgrade: {
          requires_sales_manager_approval: true,
          effective: "next_billing_cycle",
        },
      },
    };
  }

  function onSubmit(values: BillingFormValues) {
    const { name, customer_type } = values;
    const content = toApiContent(values);
    if (form === "new" || form === "clone") {
      createSchema.mutate({ schema_type: activeSchemaType, name, customer_type, content });
    } else if (form === "edit" && selectedSchemaId) {
      editSchema.mutate({
        id: selectedSchemaId,
        name,
        customer_type,
        originalName: schemaDetail?.name ?? "",
        originalCustomerType: schemaDetail?.customer_type ?? "",
        content,
      });
    } else if (isOverride && overrideCustomerSchema) {
      updateCustomerSchema.mutate(
        { id: overrideCustomerSchema.id, payload: { overridden_content: content as unknown as Record<string, unknown> } },
        {
          onSuccess: () => { toast.success("Schema override saved"); closeSchemaSheet(); },
          onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to save override"),
        },
      );
    }
  }

  useEffect(() => {
    if (isOverride) {
      setFormSubmitter(() => {
        const current = getValues();
        const changes = computeOverrideChanges(overrideSnapshot, current);
        pendingOverrideContent.current = toApiContent(current) as unknown as Record<string, unknown>;
        openOverrideConfirm(changes);
      });
    } else {
      setFormSubmitter(handleSubmit(onSubmit));
    }
    return () => setFormSubmitter(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectedSchemaId, isOverride, overrideSnapshot]);

  useEffect(() => {
    if (!isOverride || overrideConfirmTrigger === 0 || !pendingOverrideContent.current || !overrideCustomerSchema) return;
    updateCustomerSchema.mutate(
      { id: overrideCustomerSchema.id, payload: { overridden_content: pendingOverrideContent.current } },
      {
        onSuccess: () => { toast.success("Schema override saved"); closeSchemaSheet(); },
        onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to save override"),
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrideConfirmTrigger]);

  const allValues = watch();

  return (
    <OverrideDiffProvider
      enabled={isOverride}
      originalValues={overrideSnapshot as unknown as Record<string, unknown>}
      currentValues={allValues as unknown as Record<string, unknown>}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <ScrollArea className="flex-1 px-6 py-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
              <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
              {t("administration.schema.loadingSchema")}
            </div>
          ) : (
          <div className="space-y-8 pb-6">

            {!isOverride && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <RiInformationLine className="size-4 text-blue-500" />
                  <h3 className="text-sm font-semibold">{t("administration.schema.basicInfo")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      {t("administration.schema.schemaName")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder={t("administration.schema.schemaNamePlaceholder")}
                      disabled={isDetailMode}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      {t("administration.schema.customerType")}
                    </Label>
                    <Select
                      value={watch("customer_type")}
                      onValueChange={(v) =>
                        setValue("customer_type", v as BillingFormValues["customer_type"])
                      }
                      disabled={isDetailMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((ct) => (
                          <SelectItem key={ct.id} value={ct.name}>{ct.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <BillingCycleSection form={rhfForm} disabled={isDetailMode} />
            <OtcSection form={rhfForm} disabled={isDetailMode} />
            <PaymentSection form={rhfForm} disabled={isDetailMode} />
            <PricingContractSection form={rhfForm} disabled={isDetailMode} />

          </div>
          )}
        </ScrollArea>
      </div>
    </OverrideDiffProvider>
  );
}
