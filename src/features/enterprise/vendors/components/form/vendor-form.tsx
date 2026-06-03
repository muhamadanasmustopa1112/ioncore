"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vendor, CreateVendorPayload } from "../../types/vendor";

const vendorSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  service_categories: z.string().min(1, "At least one category is required"),
  payment_terms: z.enum(["net_15", "net_30", "net_45", "net_60"]),
  npwp: z.string().optional(),
  nib: z.string().optional(),
  is_active: z.boolean(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

export interface VendorFormRef {
  submit: () => void;
}

interface VendorFormProps {
  selected: Vendor | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateVendorPayload) => void;
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

export const VendorForm = forwardRef<VendorFormRef, VendorFormProps>(
  function VendorForm({ selected, mode, onSubmit }, ref) {
    const isDetail = mode === "details";
    const { t } = useTranslation();

    const { register, handleSubmit, control, formState: { errors } } = useForm<VendorFormValues>({
      resolver: zodResolver(vendorSchema),
      defaultValues: (selected && mode !== "new") ? {
        company_name: selected.company_name,
        contact_person: selected.contact_person,
        phone: selected.phone,
        email: selected.email,
        address: selected.address,
        service_categories: selected.service_categories[0] || "",
        payment_terms: selected.payment_terms,
        npwp: selected.npwp || "",
        nib: selected.nib || "",
        is_active: selected.status === "active",
      } : {
        company_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        service_categories: "",
        payment_terms: "net_30",
        npwp: "",
        nib: "",
        is_active: true,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit((v) =>
        onSubmit({
          company_name: v.company_name,
          contact_person: v.contact_person,
          phone: v.phone,
          email: v.email,
          address: v.address,
          service_categories: [v.service_categories],
          payment_terms: v.payment_terms,
          npwp: v.npwp || undefined,
          nib: v.nib || undefined,
          is_active: v.is_active,
        })
      )(),
    }));

    return (
      <div className="space-y-4 px-6 py-5">
        <Field label={t("enterprise.vendors.form.companyName", "Company Name")} required error={errors.company_name?.message}>
          <Input placeholder={t("enterprise.vendors.form.companyNamePlaceholder", "e.g. PT Teknologi Nusantara")} {...register("company_name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.vendors.form.contactPerson", "Contact Person")} required error={errors.contact_person?.message}>
            <Input placeholder={t("enterprise.vendors.form.contactPersonPlaceholder", "e.g. Budi Santoso")} {...register("contact_person")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.vendors.form.phone", "Phone")} required error={errors.phone?.message}>
            <Input placeholder="+62 21 5551234" {...register("phone")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("enterprise.vendors.form.email", "Email")} required error={errors.email?.message}>
          <Input type="email" placeholder="email@company.co.id" {...register("email")} disabled={isDetail} />
        </Field>

        <Field label={t("enterprise.vendors.form.address", "Address")} required error={errors.address?.message}>
          <Input placeholder={t("enterprise.vendors.form.addressPlaceholder", "Full address")} {...register("address")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.vendors.form.serviceCategory", "Service Category")} required error={errors.service_categories?.message}>
            <Controller name="service_categories" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue placeholder={t("enterprise.vendors.form.selectCategory", "Select category")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="connectivity">{t("enterprise.vendors.categories.connectivity", "Connectivity")}</SelectItem>
                  <SelectItem value="security">{t("enterprise.vendors.categories.security", "Security")}</SelectItem>
                  <SelectItem value="entertainment">{t("enterprise.vendors.categories.entertainment", "Entertainment")}</SelectItem>
                  <SelectItem value="data_center">{t("enterprise.vendors.categories.dataCenter", "Data Center")}</SelectItem>
                  <SelectItem value="managed">{t("enterprise.vendors.categories.managed", "Managed Services")}</SelectItem>
                  <SelectItem value="infrastructure">{t("enterprise.vendors.categories.infrastructure", "Infrastructure")}</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label={t("enterprise.vendors.form.paymentTerms", "Payment Terms")} required>
            <Controller name="payment_terms" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="net_45">Net 45</SelectItem>
                  <SelectItem value="net_60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="NPWP">
            <Input placeholder={t("common.optional", "Optional")} {...register("npwp")} disabled={isDetail} />
          </Field>
          <Field label="NIB">
            <Input placeholder={t("common.optional", "Optional")} {...register("nib")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("common.status", "Status")}>
          <Controller name="is_active" control={control} render={({ field }) => (
            <Select value={field.value ? "true" : "false"} onValueChange={(v) => field.onChange(v === "true")} disabled={isDetail}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">{t("common.active", "Active")}</SelectItem>
                <SelectItem value="false">{t("common.inactive", "Inactive")}</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </Field>
      </div>
    );
  }
);
