"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ewo, CreateEwoPayload, EwoType, EwoPriority } from "../../types/ewo";

const ewoSchema = z.object({
  project_id: z.string().min(1, "Project ID is required"),
  project_name: z.string().min(1, "Project name is required"),
  ic_po_id: z.string().min(1, "IC-PO ID is required"),
  executing_company_name: z.string().min(1, "Executing company is required"),
  ewo_type: z.enum(["ewo_x", "ewo_y"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  assigned_technician_name: z.string().min(1, "Technician name is required"),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
  site_name: z.string().min(1, "Site name is required"),
  site_address: z.string().min(1, "Site address is required"),
  notes: z.string().optional(),
});

type EwoFormValues = z.infer<typeof ewoSchema>;

export interface EwoFormRef {
  submit: () => void;
}

interface EwoFormProps {
  selected: Ewo | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateEwoPayload) => void;
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

export const EwoForm = forwardRef<EwoFormRef, EwoFormProps>(
  function EwoForm({ selected, mode, onSubmit }, ref) {
    const isDetail = mode === "details";
    const { t } = useTranslation();

    const { register, handleSubmit, control, formState: { errors } } = useForm<EwoFormValues>({
      resolver: zodResolver(ewoSchema),
      defaultValues: (selected && mode !== "new") ? {
        project_id: selected.project_id,
        project_name: selected.project_name,
        ic_po_id: selected.ic_po_id,
        executing_company_name: selected.executing_company_name,
        ewo_type: selected.ewo_type,
        priority: selected.priority,
        assigned_technician_name: selected.assigned_technician_name,
        scheduled_date: selected.scheduled_date,
        site_name: selected.site_name,
        site_address: selected.site_address,
        notes: selected.notes,
      } : {
        project_id: "",
        project_name: "",
        ic_po_id: "",
        executing_company_name: "",
        ewo_type: "ewo_x" as EwoType,
        priority: "medium" as EwoPriority,
        assigned_technician_name: "",
        scheduled_date: "",
        site_name: "",
        site_address: "",
        notes: "",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit((v) =>
        onSubmit({
          project_id: v.project_id,
          project_name: v.project_name,
          ic_po_id: v.ic_po_id,
          executing_company_name: v.executing_company_name,
          ewo_type: v.ewo_type,
          priority: v.priority,
          assigned_technician_name: v.assigned_technician_name,
          scheduled_date: v.scheduled_date,
          site_name: v.site_name,
          site_address: v.site_address,
          notes: v.notes || "",
        })
      )(),
    }));

    return (
      <div className="space-y-4 px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.ewo.form.projectName", "Project Name")} required error={errors.project_name?.message}>
            <Input placeholder={t("enterprise.ewo.form.projectNamePlaceholder", "e.g. Jakarta FTTH Rollout")} {...register("project_name")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.ewo.form.projectId", "Project ID")} required error={errors.project_id?.message}>
            <Input placeholder="PRJ-001" {...register("project_id")} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.ewo.form.icPoId", "IC-PO ID")} required error={errors.ic_po_id?.message}>
            <Input placeholder="ICPO-2026-001" {...register("ic_po_id")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.ewo.form.executingCompany", "Executing Company")} required error={errors.executing_company_name?.message}>
            <Input placeholder={t("enterprise.ewo.form.executingCompanyPlaceholder", "e.g. PT Teknologi Nusantara")} {...register("executing_company_name")} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.ewo.form.ewoType", "EWO Type")} required>
            <Controller name="ewo_type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ewo_x">{t("enterprise.ewo.type.ewoX", "EWO-X")}</SelectItem>
                  <SelectItem value="ewo_y">{t("enterprise.ewo.type.ewoY", "EWO-Y")}</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label={t("enterprise.ewo.form.priority", "Priority")} required>
            <Controller name="priority" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("enterprise.ewo.priority.low", "Low")}</SelectItem>
                  <SelectItem value="medium">{t("enterprise.ewo.priority.medium", "Medium")}</SelectItem>
                  <SelectItem value="high">{t("enterprise.ewo.priority.high", "High")}</SelectItem>
                  <SelectItem value="critical">{t("enterprise.ewo.priority.critical", "Critical")}</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.ewo.form.assignedTechnician", "Assigned Technician")} required error={errors.assigned_technician_name?.message}>
            <Input placeholder={t("enterprise.ewo.form.technicianPlaceholder", "e.g. Ahmad Fauzi")} {...register("assigned_technician_name")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.ewo.form.scheduledDate", "Scheduled Date")} required error={errors.scheduled_date?.message}>
            <Input type="date" {...register("scheduled_date")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("enterprise.ewo.form.siteName", "Site Name")} required error={errors.site_name?.message}>
          <Input placeholder="SITE-JKS-001" {...register("site_name")} disabled={isDetail} />
        </Field>

        <Field label={t("enterprise.ewo.form.siteAddress", "Site Address")} required error={errors.site_address?.message}>
          <Input placeholder={t("enterprise.ewo.form.siteAddressPlaceholder", "Full site address")} {...register("site_address")} disabled={isDetail} />
        </Field>

        <Field label={t("enterprise.ewo.form.notes", "Notes")}>
          <Textarea placeholder={t("enterprise.ewo.form.notesPlaceholder", "Additional notes or instructions...")} {...register("notes")} disabled={isDetail} rows={3} />
        </Field>
      </div>
    );
  }
);
