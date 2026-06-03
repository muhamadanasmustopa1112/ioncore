"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project, CreateProjectPayload } from "../../types/project";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  account_manager: z.string().min(1, "Account manager is required"),
  project_type: z.enum(["new_installation", "expansion", "upgrade", "migration"]),
  contract_value: z.number().min(0, "Contract value must be positive"),
  currency: z.literal("IDR"),
  contract_start_date: z.string().min(1, "Start date is required"),
  contract_end_date: z.string().min(1, "End date is required"),
  status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export interface ProjectFormRef {
  submit: () => void;
}

interface ProjectFormProps {
  selected: Project | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateProjectPayload) => void;
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

export const ProjectForm = forwardRef<ProjectFormRef, ProjectFormProps>(
  function ProjectForm({ selected, mode, onSubmit }, ref) {
    const isDetail = mode === "details";
    const { t } = useTranslation();

    const { register, handleSubmit, control, formState: { errors } } = useForm<ProjectFormValues>({
      resolver: zodResolver(projectSchema),
      defaultValues: (selected && mode !== "new") ? {
        project_name: selected.project_name,
        customer_name: selected.customer_name,
        account_manager: selected.account_manager,
        project_type: selected.project_type,
        contract_value: selected.contract_value,
        currency: "IDR",
        contract_start_date: selected.contract_start_date,
        contract_end_date: selected.contract_end_date,
        status: selected.status,
      } : {
        project_name: "",
        customer_name: "",
        account_manager: "",
        project_type: "new_installation",
        contract_value: 0,
        currency: "IDR",
        contract_start_date: "",
        contract_end_date: "",
        status: "planning",
      },
    });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit((v) =>
        onSubmit({
          project_name: v.project_name,
          customer_id: selected?.customer_id ?? "",
          customer_name: v.customer_name,
          account_manager: v.account_manager,
          project_type: v.project_type,
          contract_value: Number(v.contract_value),
          currency: "IDR",
          contract_start_date: v.contract_start_date,
          contract_end_date: v.contract_end_date,
          sla_template_id: selected?.sla_template_id ?? "",
          status: v.status,
        })
      )(),
    }));

    return (
      <div className="space-y-4 px-6 py-5">
        <Field label={t("enterprise.projects.form.name", "Project Name")} required error={errors.project_name?.message}>
          <Input placeholder={t("enterprise.projects.form.namePlaceholder", "e.g. PT Bank Mandiri - Dedicated Internet")} {...register("project_name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.projects.form.customer", "Customer")} required error={errors.customer_name?.message}>
            <Input placeholder={t("enterprise.projects.form.customerPlaceholder", "e.g. PT Bank Mandiri")} {...register("customer_name")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.projects.form.accountManager", "Account Manager")} required error={errors.account_manager?.message}>
            <Input placeholder={t("enterprise.projects.form.amPlaceholder", "e.g. Siti Rahmawati")} {...register("account_manager")} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.projects.form.type", "Project Type")} required>
            <Controller name="project_type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_installation">{t("enterprise.projects.types.newInstallation", "New Installation")}</SelectItem>
                  <SelectItem value="expansion">{t("enterprise.projects.types.expansion", "Expansion")}</SelectItem>
                  <SelectItem value="upgrade">{t("enterprise.projects.types.upgrade", "Upgrade")}</SelectItem>
                  <SelectItem value="migration">{t("enterprise.projects.types.migration", "Migration")}</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label={t("enterprise.projects.form.contractValue", "Contract Value (IDR)")} required error={errors.contract_value?.message}>
            <Input type="number" {...register("contract_value")} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.projects.form.startDate", "Start Date")} required error={errors.contract_start_date?.message}>
            <Input type="date" {...register("contract_start_date")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.projects.form.endDate", "End Date")} required error={errors.contract_end_date?.message}>
            <Input type="date" {...register("contract_end_date")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("common.status", "Status")}>
          <Controller name="status" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">{t("enterprise.projects.status.planning", "Planning")}</SelectItem>
                <SelectItem value="in_progress">{t("enterprise.projects.status.inProgress", "In Progress")}</SelectItem>
                <SelectItem value="on_hold">{t("enterprise.projects.status.onHold", "On Hold")}</SelectItem>
                <SelectItem value="completed">{t("enterprise.projects.status.completed", "Completed")}</SelectItem>
                <SelectItem value="cancelled">{t("enterprise.projects.status.cancelled", "Cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </Field>
      </div>
    );
  }
);
