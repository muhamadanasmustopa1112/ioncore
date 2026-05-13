"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddLine, RiInformationLine, RiFileListLine, RiUserStarLine } from "@remixicon/react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
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
import {
  workOrderFormSchema,
  type WorkOrderFormValues,
  type ProofOfWorkItemFormValues,
} from "../../../types/work-order-schema";
import { useSchemaStore } from "../../../store/schema";
import {
  useCreateSchema,
  useUpdateSchemaContent,
  useSchema,
  useSchemaVersions,
} from "../../../api/schema-queries";
import { PowItemRow } from "./pow-item-row";

const DEFAULT_ITEM: ProofOfWorkItemFormValues = {
  item_id: "",
  item_label: "",
  category: "photo",
  field_type: "photo",
  required: true,
};

const DEFAULT_VALUES: WorkOrderFormValues = {
  name: "",
  customer_type: "residential",
  wo_type: "installation",
  proof_of_work: [{ ...DEFAULT_ITEM, item_id: "pow-1", item_label: "Before photo" }],
  sign_off_mode: "onsite",
};

function fromApiContent(raw: Record<string, unknown>): Partial<WorkOrderFormValues> {
  const pows = raw.proof_of_work as ProofOfWorkItemFormValues[] | undefined;
  const signOff = raw.customer_sign_off as { mode?: string } | undefined;
  return {
    wo_type: (raw.wo_type as WorkOrderFormValues["wo_type"]) ?? "installation",
    proof_of_work: pows?.map((p) => ({
      item_id: p.item_id,
      item_label: p.item_label,
      category: p.category,
      field_type: p.field_type,
      required: p.required,
    })) ?? DEFAULT_VALUES.proof_of_work,
    sign_off_mode: (signOff?.mode as WorkOrderFormValues["sign_off_mode"]) ?? "onsite",
  };
}

export function WorkOrderForm() {
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter } = useSchemaStore();
  const isDetailMode = form === "details";

  const createSchema = useCreateSchema();
  const updateSchema = useUpdateSchemaContent();

  const rhf = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const { register, watch, setValue, handleSubmit, reset, control, formState: { errors } } = rhf;

  const { fields, append, remove } = useFieldArray({ control, name: "proof_of_work" });

  const { data: schemaDetail } = useSchema(
    form === "edit" || form === "details" || form === "clone" ? selectedSchemaId : null
  );
  const { data: schemaVersions } = useSchemaVersions(
    form === "edit" || form === "details" || form === "clone" ? selectedSchemaId : null
  );

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    reset({
      ...DEFAULT_VALUES,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as WorkOrderFormValues["customer_type"],
      ...fromApiContent(raw),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  function toApiContent(values: WorkOrderFormValues) {
    return {
      wo_type: values.wo_type,
      proof_of_work: values.proof_of_work.map((p) => ({
        item_id: p.item_id,
        item_label: p.item_label,
        category: p.category,
        field_type: p.field_type,
        required: p.required,
        completed: false,
        value: null,
        checked: false,
        notes: "",
        evidence: [],
        completed_by: null,
        completed_at: null,
      })),
      customer_sign_off: {
        mode: values.sign_off_mode,
        status: null,
        confirmed_at: null,
        signed_by: null,
        signature_url: null,
        gps_stamp: null,
      },
    };
  }

  function onSubmit(values: WorkOrderFormValues) {
    const content = toApiContent(values);
    if (form === "new" || form === "clone") {
      createSchema.mutate({
        schema_type: activeSchemaType,
        name: values.name,
        customer_type: values.customer_type,
        content,
      });
    } else if (form === "edit" && selectedSchemaId) {
      updateSchema.mutate({ id: selectedSchemaId, payload: { content } });
    }
  }

  useEffect(() => {
    setFormSubmitter(handleSubmit(onSubmit));
    return () => setFormSubmitter(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectedSchemaId]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Basic Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label className="text-xs font-medium text-muted-foreground">Schema Name <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Installation WO Schema" disabled={isDetailMode} {...register("name")} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Customer Type</Label>
                <Select value={watch("customer_type")} onValueChange={(v) => setValue("customer_type", v as WorkOrderFormValues["customer_type"])} disabled={isDetailMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">WO Type <span className="text-red-500">*</span></Label>
                <Select value={watch("wo_type")} onValueChange={(v) => setValue("wo_type", v as WorkOrderFormValues["wo_type"])} disabled={isDetailMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="deactivation">Deactivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Proof of Work Items */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <RiFileListLine className="size-4 text-violet-500" />
                <h3 className="text-sm font-semibold">Proof of Work</h3>
                <span className="text-xs text-muted-foreground">({fields.length} items)</span>
              </div>
              {!isDetailMode && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => append({ ...DEFAULT_ITEM, item_id: `pow-${nanoid(4)}` })}
                >
                  <RiAddLine className="size-3.5" /> Add Item
                </Button>
              )}
            </div>
            {errors.proof_of_work?.root && (
              <p className="text-xs text-red-500">{errors.proof_of_work.root.message}</p>
            )}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <PowItemRow
                  key={field.id}
                  index={index}
                  form={rhf}
                  isDetailMode={isDetailMode}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          </div>

          {/* Customer Sign-Off */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiUserStarLine className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Customer Sign-Off</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["onsite", "otp"] as const).map((mode) => {
                const active = watch("sign_off_mode") === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    disabled={isDetailMode}
                    onClick={() => setValue("sign_off_mode", mode)}
                    className={[
                      "rounded-xl border-2 px-4 py-4 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/20 hover:border-muted-foreground/40",
                      isDetailMode ? "cursor-default opacity-70" : "cursor-pointer",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold capitalize">{mode === "otp" ? "OTP" : "Onsite"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {mode === "onsite"
                        ? "Customer physically signs on the technician's device at the installation point."
                        : "Customer receives a one-time code via SMS / WhatsApp and confirms remotely."}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
