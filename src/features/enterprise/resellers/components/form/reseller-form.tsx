"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Reseller, CreateResellerPayload } from "../../types/reseller";

const resellerSchema = z.object({
  legal_name: z.string().min(1, "Legal name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  tax_id: z.string().min(1, "Tax ID is required"),
  parent_sister_company_id: z.string().min(1, "Sponsor company is required"),
  status: z.enum(["draft", "active", "suspended", "terminated"]),
  platform_tenant_id: z.string().optional(),
});

type ResellerFormValues = z.infer<typeof resellerSchema>;

export interface ResellerFormRef {
  submit: () => void;
}

interface ResellerFormProps {
  selected: Reseller | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateResellerPayload) => void;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export const ResellerForm = forwardRef<ResellerFormRef, ResellerFormProps>(
  function ResellerForm({ selected, mode, onSubmit }, ref) {
    const isDetail = mode === "details";
    const { t } = useTranslation();

    const { register, handleSubmit, control, formState: { errors } } = useForm<ResellerFormValues>({
      resolver: zodResolver(resellerSchema),
      defaultValues: (selected && mode !== "new") ? {
        legal_name: selected.legal_name,
        contact_person: selected.contact_person,
        phone: selected.phone,
        email: selected.email,
        address: selected.address,
        tax_id: selected.tax_id,
        parent_sister_company_id: selected.parent_sister_company_id,
        status: selected.status,
        platform_tenant_id: selected.platform_tenant_id,
      } : {
        legal_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        tax_id: "",
        parent_sister_company_id: "",
        status: "draft",
        platform_tenant_id: "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit((v) =>
        onSubmit({
          legal_name: v.legal_name,
          contact_person: v.contact_person,
          phone: v.phone,
          email: v.email,
          address: v.address,
          tax_id: v.tax_id,
          parent_sister_company_id: v.parent_sister_company_id,
          status: v.status,
          platform_tenant_id: v.platform_tenant_id || undefined,
        })
      )(),
    }));

    return (
      <div className="space-y-4 px-6 py-5">
        <Field label={t("enterprise.resellers.form.legalName", "Legal Name")} required error={errors.legal_name?.message}>
          <Input placeholder={t("enterprise.resellers.form.legalNamePlaceholder", "e.g. PT Jaringan Nusantara")} {...register("legal_name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.resellers.form.contactPerson", "Contact Person")} required error={errors.contact_person?.message}>
            <Input placeholder={t("enterprise.resellers.form.contactPersonPlaceholder", "e.g. Budi Santoso")} {...register("contact_person")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.resellers.form.phone", "Phone")} required error={errors.phone?.message}>
            <Input placeholder="+62 21 5551234" {...register("phone")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("enterprise.resellers.form.email", "Email")} required error={errors.email?.message}>
          <Input type="email" placeholder="email@company.co.id" {...register("email")} disabled={isDetail} />
        </Field>

        <Field label={t("enterprise.resellers.form.address", "Address")} required error={errors.address?.message}>
          <Input placeholder={t("enterprise.resellers.form.addressPlaceholder", "Full address")} {...register("address")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.resellers.form.taxId", "Tax ID (NPWP)")} required error={errors.tax_id?.message}>
            <Input placeholder="01.234.567.8-012.000" {...register("tax_id")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.resellers.form.sponsorCompany", "Sponsor Company")} required error={errors.parent_sister_company_id?.message}>
            <Controller name="parent_sister_company_id" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue placeholder={t("enterprise.resellers.form.selectSponsor", "Select sponsor")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp-001">PT Aman Sentosa</SelectItem>
                  <SelectItem value="comp-002">PT Visi Teknologi</SelectItem>
                  <SelectItem value="comp-003">PT Cahaya Fiber</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.resellers.form.platformTenantId", "Platform Tenant ID")}>
            <Input placeholder={t("common.optional", "Optional")} {...register("platform_tenant_id")} disabled={isDetail} />
          </Field>
          <Field label={t("common.status", "Status")}>
            <Controller name="status" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("common.draft", "Draft")}</SelectItem>
                  <SelectItem value="active">{t("common.active", "Active")}</SelectItem>
                  <SelectItem value="suspended">{t("common.suspended", "Suspended")}</SelectItem>
                  <SelectItem value="terminated">{t("common.terminated", "Terminated")}</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>
      </div>
    );
  }
);
