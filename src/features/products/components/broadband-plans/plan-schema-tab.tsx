"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RiAddLine, RiLoader4Line } from "@remixicon/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBroadbandPlanSchemas,
  useCreateBroadbandPlanSchema,
  useDeleteBroadbandPlanSchema,
} from "@/features/rule-schema";
import { useSchemaList } from "@/features/administration/schema/api/schema-queries";
import { SCHEMA_TYPE_OPTIONS } from "@/features/administration/schema/types/schema-type-constants";

export interface PendingSchema {
  schemaId: string;
  schemaName: string;
  schemaType: string;
}

interface PlanSchemaTabProps {
  planId: string | null;
  readOnly?: boolean;
  customerType?: string;
  // new-plan mode
  pending?: PendingSchema[];
  onAddPending?: (s: PendingSchema) => void;
  onRemovePending?: (schemaId: string) => void;
}

const TYPE_COLOR: Record<string, string> = {
  BILLING:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ONBOARDING: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  SERVICE:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  COMMISSION: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUSPENSION: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  WORK_ORDER: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

function typeColor(t: string) {
  return TYPE_COLOR[t.toUpperCase()] ?? "bg-muted text-muted-foreground";
}

// ── Add row (inline form) ─────────────────────────────────

interface AddRowProps {
  planId: string | null;
  usedTypes: string[];
  customerType?: string;
  onAddPending?: (s: PendingSchema) => void;
}

function AddRow({ planId, usedTypes, customerType, onAddPending }: AddRowProps) {
  const [schemaType, setSchemaType] = useState("");
  const [schemaId, setSchemaId]     = useState("");

  const { data: schemasData } = useSchemaList(
    schemaType ? { schemaType, hasSchemaPublished: true, ...(customerType ? { customerType } : {}) } : {}
  );
  const schemas = schemasData?.schemas ?? [];
  const availableTypes = SCHEMA_TYPE_OPTIONS.filter((t) => !usedTypes.includes(t.value));

  const create = useCreateBroadbandPlanSchema();

  function handleTypeChange(v: string) {
    setSchemaType(v);
    setSchemaId("");
  }

  function handleAssign() {
    if (!schemaType || !schemaId) return;
    const schema = schemas.find((s) => s.id === schemaId);
    if (!schema) return;

    if (planId) {
      // edit mode — fire mutation immediately
      create.mutate(
        { broadband_plan_id: planId, schema_id: schemaId, schema_type: schemaType },
        { onSuccess: () => { setSchemaType(""); setSchemaId(""); } },
      );
    } else {
      // new mode — push to pending list
      onAddPending?.({ schemaId, schemaName: schema.name, schemaType });
      setSchemaType("");
      setSchemaId("");
    }
  }

  const allAssigned = availableTypes.length === 0;

  if (allAssigned) {
    return (
      <p className="text-xs text-muted-foreground py-1">
        All schema types have been assigned to this plan.
      </p>
    );
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Select value={schemaType} onValueChange={handleTypeChange}>
        <SelectTrigger className="flex-1 min-w-[130px]">
          <SelectValue placeholder="Schema type…" />
        </SelectTrigger>
        <SelectContent>
          {availableTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={schemaId} onValueChange={setSchemaId} disabled={!schemaType}>
        <SelectTrigger className="flex-1 min-w-[160px]">
          <SelectValue placeholder={schemaType ? "Select schema…" : "Choose type first"} />
        </SelectTrigger>
        <SelectContent>
          {schemas.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="primary"
        className="shrink-0"
        disabled={!schemaType || !schemaId || create.isPending}
        onClick={handleAssign}
      >
        <RiAddLine className="size-4" />
        {create.isPending ? "Assigning…" : "Assign"}
      </Button>
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────

export function PlanSchemaTab({
  planId,
  readOnly,
  customerType,
  pending = [],
  onAddPending,
  onRemovePending,
}: PlanSchemaTabProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: listEnv, isLoading } = useBroadbandPlanSchemas(
    planId ? { broadband_plan_id: planId, size: 100 } : undefined,
  );
  const liveSchemas = planId ? (listEnv?.data?.broadband_plan_schemas ?? []) : [];

  const deleteSchema = useDeleteBroadbandPlanSchema();

  // In new-mode show pending, in edit/details show live
  const rows = planId ? liveSchemas : pending;
  const usedTypes = rows.map((r) => ("schema_type" in r ? r.schema_type : r.schemaType));

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-4">
      {!readOnly && (
        <AddRow planId={planId} usedTypes={usedTypes} customerType={customerType} onAddPending={onAddPending} />
      )}

      {isLoading && planId ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />Loading schemas…
        </div>
      ) : rows.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No schemas assigned yet.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {rows.map((row) => {
              const id   = "id" in row ? row.id : row.schemaId;
              const name = "schema_name" in row ? row.schema_name : row.schemaName;
              const type = "schema_type" in row ? row.schema_type : row.schemaType;
              return (
                <div key={id} className="flex items-center gap-3 rounded-md border px-3 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 uppercase ${typeColor(type)}`}>
                    {type.replace(/_/g, " ")}
                  </span>
                  <p className="flex-1 text-sm font-medium truncate">{name}</p>
                  {!readOnly && (
                    <Button
                      mode="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (planId) {
                          setDeleteTarget({ id, name });
                        } else {
                          onRemovePending?.(id);
                        }
                      }}
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <p className="text-xs text-muted-foreground">
        {rows.length} schema{rows.length !== 1 ? "s" : ""} assigned
      </p>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove schema assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unlink{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span> from this
              plan. The schema itself will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSchema.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteSchema.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  deleteSchema.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
                }
              }}
            >
              {deleteSchema.isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
