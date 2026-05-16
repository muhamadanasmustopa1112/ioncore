"use client";

import { useState } from "react";
import { RiWifiLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminBroadbandPlans } from "@/features/products/api/products-queries";
import { useSchemaList } from "../../api/schema-queries";
import { useCreateBroadbandPlanSchema, useBroadbandPlanSchemas } from "@/features/rule-schema";
import { SCHEMA_TYPE_OPTIONS } from "../../types/schema-type-constants";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlanId?: string;
}

export function BroadbandPlanSchemaFormSheet({ open, onOpenChange, defaultPlanId }: Props) {
  const [planId, setPlanId] = useState(defaultPlanId ?? "");
  const [schemaType, setSchemaType] = useState("");
  const [schemaId, setSchemaId] = useState("");

  const { data: plansData } = useAdminBroadbandPlans({ per_page: 100 });
  const { data: schemasData } = useSchemaList(
    schemaType ? { schemaType, hasSchemaPublished: true } : {}
  );
  const { data: assignedEnv } = useBroadbandPlanSchemas(
    planId ? { broadband_plan_id: planId, size: 100 } : undefined
  );

  const plans = plansData?.broadband_plans ?? [];
  const schemas = schemasData?.schemas ?? [];
  const usedTypes = new Set(
    (assignedEnv?.data?.broadband_plan_schemas ?? []).map((s) => s.schema_type.toUpperCase())
  );
  const availableTypes = SCHEMA_TYPE_OPTIONS.filter((t) => !usedTypes.has(t.value.toUpperCase()));

  const create = useCreateBroadbandPlanSchema();

  function handleClose() {
    setPlanId(defaultPlanId ?? "");
    setSchemaType("");
    setSchemaId("");
    onOpenChange(false);
  }

  function handleSubmit() {
    if (!planId || !schemaType || !schemaId) return;
    create.mutate(
      { broadband_plan_id: planId, schema_id: schemaId, schema_type: schemaType },
      { onSuccess: handleClose }
    );
  }

  const valid = !!planId && !!schemaType && !!schemaId;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        aria-describedby={undefined}
        className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl"
      >
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiWifiLine className="size-5 text-muted-foreground" />
            Assign Schema to Plan
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 px-6 py-5 space-y-5">
          <p className="text-sm text-muted-foreground">
            Link a rule schema to a broadband plan. The system will apply this schema when processing orders or billing for that plan.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Broadband Plan <span className="text-red-500">*</span>
            </Label>
            <Select value={planId} onValueChange={(v) => { setPlanId(v); setSchemaType(""); setSchemaId(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan..." />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Schema Type <span className="text-red-500">*</span>
            </Label>
            {planId && availableTypes.length === 0 ? (
              <p className="text-xs text-muted-foreground rounded-md border border-dashed px-3 py-2.5">
                All schema types have already been assigned to this plan.
              </p>
            ) : (
              <Select
                value={schemaType}
                onValueChange={(v) => { setSchemaType(v); setSchemaId(""); }}
                disabled={!!planId && availableTypes.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Schema <span className="text-red-500">*</span>
            </Label>
            <Select
              value={schemaId}
              onValueChange={setSchemaId}
              disabled={!schemaType}
            >
              <SelectTrigger>
                <SelectValue placeholder={schemaType ? "Select schema..." : "Choose type first"} />
              </SelectTrigger>
              <SelectContent>
                {schemas.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 mt-auto">
          <Button variant="ghost" onClick={handleClose}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={handleClose} className="mr-3" disabled={create.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!valid || create.isPending}
            className="font-semibold"
          >
            {create.isPending ? "Assigning..." : "Assign Schema"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
