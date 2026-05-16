"use client";

import { useEffect } from "react";
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
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
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
            {mode === "edit" ? "Edit Customer Type" : "New Customer Type"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5">
          <form id="customer-type-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Name" required error={errors.name?.message}>
              <Input {...register("name")} placeholder="e.g. residential" />
            </Field>
            <Field label="Label" required error={errors.label?.message}>
              <Input {...register("label")} placeholder="e.g. Residential" />
            </Field>
            <Field label="Description" error={errors.description?.message}>
              <Textarea {...register("description")} placeholder="Optional description" rows={3} />
            </Field>
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Available for selection in products and forms</p>
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
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="customer-type-form" disabled={isPending} className="flex-1">
            {isPending ? "Saving…" : mode === "edit" ? "Save Changes" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
