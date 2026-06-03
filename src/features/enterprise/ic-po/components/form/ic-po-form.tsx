"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { IntercompanyPo, CreateIcPoPayload } from "../../types/ic-po";

const lineSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  quantity: z.number().min(1, "Min 1"),
  unit: z.string().min(1, "Unit is required"),
  unit_price: z.number().min(1, "Min 1"),
  expected_delivery_date: z.string().min(1, "Date is required"),
});

const icPoSchema = z.object({
  issuer_company_name: z.string().min(1, "Issuer company is required"),
  receiver_company_name: z.string().min(1, "Receiver company is required"),
  project_id: z.string().optional(),
  lines: z.array(lineSchema).min(1, "At least one line item is required"),
});

type IcPoFormValues = z.infer<typeof icPoSchema>;

export interface IcPoFormRef {
  submit: () => void;
}

interface IcPoFormProps {
  selected: IntercompanyPo | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateIcPoPayload) => void;
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

export const IcPoForm = forwardRef<IcPoFormRef, IcPoFormProps>(
  function IcPoForm({ selected, mode, onSubmit }, ref) {
    const isDetail = mode === "details";
    const { t } = useTranslation();

    const { register, handleSubmit, control, formState: { errors } } = useForm<IcPoFormValues>({
      resolver: zodResolver(icPoSchema),
      defaultValues: (selected && mode !== "new") ? {
        issuer_company_name: selected.issuer_company_name,
        receiver_company_name: selected.receiver_company_name,
        project_id: selected.project_id || "",
        lines: selected.lines.map((l) => ({
          service_name: l.service_name,
          quantity: l.quantity,
          unit: l.unit,
          unit_price: l.unit_price,
          expected_delivery_date: l.expected_delivery_date,
        })),
      } : {
        issuer_company_name: "",
        receiver_company_name: "",
        project_id: "",
        lines: [{ service_name: "", quantity: 1, unit: "unit", unit_price: 0, expected_delivery_date: "" }],
      },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "lines" });

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit((v) =>
        onSubmit({
          issuer_company_id: selected?.issuer_company_id || "comp-001",
          issuer_company_name: v.issuer_company_name,
          receiver_company_id: selected?.receiver_company_id || "comp-002",
          receiver_company_name: v.receiver_company_name,
          project_id: v.project_id || undefined,
          lines: v.lines.map((l: IcPoFormValues["lines"][number]) => ({
            service_id: `s-${Date.now()}`,
            service_name: l.service_name,
            quantity: l.quantity,
            unit: l.unit,
            unit_price: l.unit_price,
            expected_delivery_date: l.expected_delivery_date,
          })),
        })
      )(),
    }));

    return (
      <div className="space-y-4 px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("enterprise.icPo.form.issuer", "Issuer Company")} required error={errors.issuer_company_name?.message}>
            <Input placeholder={t("enterprise.icPo.form.issuerPlaceholder", "e.g. PT ION Broadband")} {...register("issuer_company_name")} disabled={isDetail} />
          </Field>
          <Field label={t("enterprise.icPo.form.receiver", "Receiver Company")} required error={errors.receiver_company_name?.message}>
            <Input placeholder={t("enterprise.icPo.form.receiverPlaceholder", "e.g. PT Visi Teknologi")} {...register("receiver_company_name")} disabled={isDetail} />
          </Field>
        </div>

        <Field label={t("enterprise.icPo.form.projectId", "Project ID")}>
          <Input placeholder={t("common.optional", "Optional")} {...register("project_id")} disabled={isDetail} />
        </Field>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">{t("enterprise.icPo.form.lineItems", "Line Items")}</Label>
            {!isDetail && (
              <Button type="button" variant="outline" size="sm" onClick={() => append({ service_name: "", quantity: 1, unit: "unit", unit_price: 0, expected_delivery_date: "" })}>
                <RiAddLine className="size-3.5" />{t("enterprise.icPo.form.addLine", "Add Line")}
              </Button>
            )}
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-md border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                {!isDetail && fields.length > 1 && (
                  <Button type="button" variant="ghost" mode="icon" size="sm" onClick={() => remove(index)}>
                    <RiDeleteBinLine className="size-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t("enterprise.icPo.form.serviceName", "Service")} required error={errors.lines?.[index]?.service_name?.message}>
                  <Input placeholder={t("enterprise.icPo.form.servicePlaceholder", "e.g. CCTV Installation")} {...register(`lines.${index}.service_name`)} disabled={isDetail} />
                </Field>
                <Field label={t("enterprise.icPo.form.unit", "Unit")} required>
                  <Input placeholder="unit" {...register(`lines.${index}.unit`)} disabled={isDetail} />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label={t("enterprise.icPo.form.quantity", "Qty")} required error={errors.lines?.[index]?.quantity?.message}>
                  <Input type="number" {...register(`lines.${index}.quantity`)} disabled={isDetail} />
                </Field>
                <Field label={t("enterprise.icPo.form.unitPrice", "Unit Price")} required error={errors.lines?.[index]?.unit_price?.message}>
                  <Input type="number" {...register(`lines.${index}.unit_price`)} disabled={isDetail} />
                </Field>
                <Field label={t("enterprise.icPo.form.deliveryDate", "Expected Delivery")} required error={errors.lines?.[index]?.expected_delivery_date?.message}>
                  <Input type="date" {...register(`lines.${index}.expected_delivery_date`)} disabled={isDetail} />
                </Field>
              </div>
            </div>
          ))}
          {errors.lines?.root?.message && <p className="text-xs text-destructive">{errors.lines.root.message}</p>}
        </div>
      </div>
    );
  }
);
