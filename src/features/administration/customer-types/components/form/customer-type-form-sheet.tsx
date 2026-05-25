"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateCustomerType, useUpdateCustomerType } from "../../api/customer-types-queries";
import type { CustomerType } from "../../types";

const schema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  mode: "new" | "edit";
  selected: CustomerType | null;
  onClose: () => void;
}

function Field({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function CustomerTypeFormSheet({ open, mode, selected, onClose }: Props) {
  const { t } = useTranslation();
  const create = useCreateCustomerType();
  const update = useUpdateCustomerType();
  const isPending = create.isPending || update.isPending;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", label: "", description: "", is_active: true },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && selected) {
        reset({
          name: selected.name,
          label: selected.label,
          description: selected.description ?? "",
          is_active: selected.is_active,
        });
      } else {
        reset({ name: "", label: "", description: "", is_active: true });
      }
    }
  }, [open, mode, selected, reset]);

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      label: values.label,
      description: values.description,
      is_active: values.is_active,
    };
    if (mode === "edit" && selected) {
      update.mutate({ id: selected.id, payload }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[480px] flex flex-col shadow-2xl">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {mode === "edit" ? t("administration.customerTypesPage.sheetTitleEdit") : t("administration.customerTypesPage.sheetTitleNew")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5">
          <form id="customer-type-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label={t("administration.customerTypesPage.fieldName")} required error={errors.name?.message}>
              <Input {...register("name")} placeholder={t("administration.customerTypesPage.fieldNamePlaceholder")} />
            </Field>
            <Field label={t("administration.customerTypesPage.fieldLabel")} required error={errors.label?.message}>
              <Input {...register("label")} placeholder={t("administration.customerTypesPage.fieldLabelPlaceholder")} />
            </Field>
            <Field label={t("administration.customerTypesPage.fieldDescription")} error={errors.description?.message}>
              <Textarea {...register("description")} placeholder={t("administration.customerTypesPage.fieldDescriptionPlaceholder")} rows={3} />
            </Field>
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">{t("administration.customerTypesPage.fieldActive")}</p>
                <p className="text-xs text-muted-foreground">{t("administration.customerTypesPage.fieldActiveDesc")}</p>
              </div>
              <Switch
                checked={watch("is_active")}
                onCheckedChange={(v) => setValue("is_active", v)}
              />
            </div>
          </form>
        </SheetBody>

        <SheetFooter className="border-t px-5 py-4 flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
            {t("administration.customerTypesPage.cancel")}
          </Button>
          <Button variant="primary" type="submit" form="customer-type-form" disabled={isPending} className="flex-1">
            {isPending ? t("administration.customerTypesPage.saving") : mode === "edit" ? t("administration.customerTypesPage.saveChanges") : t("administration.customerTypesPage.create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
