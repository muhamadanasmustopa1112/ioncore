"use client";

import { useState } from "react";
import { X, ChevronsUpDown, CheckCircle2, AlertCircle } from "lucide-react";
import { RiLoader4Line } from "@remixicon/react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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

export type EditSchemaChange =
  | { action: "assign"; schemaId: string; schemaName: string; removeRecordId?: string }
  | { action: "remove"; removeRecordId: string };

interface PlanSchemaTabProps {
  planId: string | null;
  readOnly?: boolean;
  customerType?: string;
  // new-plan mode
  pending?: PendingSchema[];
  onAddPending?: (s: PendingSchema) => void;
  onRemovePending?: (schemaId: string) => void;
  // edit-mode buffered
  editChanges?: Record<string, EditSchemaChange>;
  onEditChange?: (schemaType: string, change: EditSchemaChange) => void;
  onEditUndo?: (schemaType: string) => void;
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

// ── Shared required row ───────────────────────────────────────

interface RequiredRowProps {
  schemaType: string;
  label: string;
  assignedName?: string;
  customerType?: string;
  readOnly?: boolean;
  isRemoving?: boolean;
  onSelect: (schemaId: string, schemaName: string) => void;
  onRemove: () => void;
}

function RequiredRow({
  schemaType,
  label,
  assignedName,
  customerType,
  readOnly,
  isRemoving,
  onSelect,
  onRemove,
}: RequiredRowProps) {
  const [open, setOpen] = useState(false);

  const { data: schemasData } = useSchemaList({
    schemaType,
    hasSchemaPublished: true,
    size: 100,
    ...(customerType ? { customerType } : {}),
  });
  const schemas = schemasData?.schemas ?? [];

  if (assignedName) {
    const assignedSchema = schemas.find((s) => s.name === assignedName);
    return (
      <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
        <CheckCircle2 className="size-4 text-green-500 shrink-0" />
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 uppercase ${typeColor(schemaType)}`}>
          {label}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{assignedName}</p>
          {assignedSchema?.latest_version && (
            <p className="text-[10px] font-mono text-muted-foreground/70">v{assignedSchema.latest_version}</p>
          )}
        </div>
        {!readOnly && (
          <Button
            mode="icon"
            variant="ghost"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
            disabled={isRemoving}
            onClick={onRemove}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-dashed border-destructive/40 bg-destructive/5 px-3 py-2.5">
      <AlertCircle className="size-4 text-destructive/60 shrink-0" />
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0 uppercase ${typeColor(schemaType)}`}>
        {label}
      </span>
      {!readOnly ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="flex-1 justify-between font-normal text-muted-foreground text-xs h-7">
              <span>Select schema…</span>
              <ChevronsUpDown className="ml-2 size-3.5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[280px]" align="start">
            <Command>
              <CommandInput placeholder="Search schema…" />
              <CommandList>
                <CommandEmpty>No published schemas found.</CommandEmpty>
                <CommandGroup>
                  {schemas.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.name}
                      onSelect={() => {
                        onSelect(s.id, s.name);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate text-sm">{s.name}</span>
                        {s.latest_version && (
                          <span className="text-[10px] font-mono text-muted-foreground/70">{s.latest_version}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <span className="flex-1 text-xs text-muted-foreground italic">Not assigned</span>
      )}
    </div>
  );
}

// ── Main tab ─────────────────────────────────────────────────

export function PlanSchemaTab({
  planId,
  readOnly,
  customerType,
  pending = [],
  onAddPending,
  onRemovePending,
  editChanges,
  onEditChange,
  onEditUndo,
}: PlanSchemaTabProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const isEditBuffered = editChanges !== undefined;

  const { data: listEnv, isLoading } = useBroadbandPlanSchemas(
    planId ? { broadband_plan_id: planId, size: 100 } : undefined,
  );
  const liveSchemas = planId ? (listEnv?.data?.broadband_plan_schemas ?? []) : [];

  const createSchema = useCreateBroadbandPlanSchema();
  const deleteSchema = useDeleteBroadbandPlanSchema();

  const assignedCount = planId ? liveSchemas.length : pending.length;
  const totalRequired = SCHEMA_TYPE_OPTIONS.length;

  // ── New mode ────────────────────────────────────────────────
  if (!planId) {
    return (
      <div className="flex flex-col h-full px-6 py-5 gap-3">
        <p className="text-xs text-muted-foreground">
          All {totalRequired} schema types are required. Select a published schema for each.
        </p>
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {SCHEMA_TYPE_OPTIONS.map((opt) => {
              const assigned = pending.find((p) => p.schemaType === opt.value);
              return (
                <RequiredRow
                  key={opt.value}
                  schemaType={opt.value}
                  label={opt.label}
                  assignedName={assigned?.schemaName}
                  customerType={customerType}
                  onSelect={(schemaId, schemaName) =>
                    onAddPending?.({ schemaId, schemaName, schemaType: opt.value })
                  }
                  onRemove={() => assigned && onRemovePending?.(assigned.schemaId)}
                />
              );
            })}
          </div>
        </ScrollArea>
        <p className="text-xs text-muted-foreground">
          {assignedCount} / {totalRequired} assigned
        </p>
      </div>
    );
  }

  // ── Edit / details mode ─────────────────────────────────────
  const effectiveAssigned = isEditBuffered
    ? SCHEMA_TYPE_OPTIONS.filter((opt) => {
        const change = editChanges![opt.value];
        if (change?.action === "remove") return false;
        if (change?.action === "assign") return true;
        return !!liveSchemas.find((r) => r.schema_type === opt.value);
      }).length
    : assignedCount;

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-3">
      <p className="text-xs text-muted-foreground">
        All {totalRequired} schema types are required.
      </p>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />Loading schemas…
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {SCHEMA_TYPE_OPTIONS.map((opt) => {
              const live = liveSchemas.find((r) => r.schema_type === opt.value);
              const change = isEditBuffered ? editChanges![opt.value] : undefined;

              let assignedName: string | undefined;
              if (isEditBuffered) {
                if (change?.action === "assign") assignedName = change.schemaName;
                else if (change?.action === "remove") assignedName = undefined;
                else assignedName = live?.schema_name;
              } else {
                assignedName = live?.schema_name;
              }

              return (
                <RequiredRow
                  key={opt.value}
                  schemaType={opt.value}
                  label={opt.label}
                  assignedName={assignedName}
                  customerType={customerType}
                  readOnly={readOnly}
                  isRemoving={!isEditBuffered && deleteSchema.isPending && deleteTarget?.id === live?.id}
                  onSelect={(schemaId, schemaName) => {
                    if (isEditBuffered) {
                      onEditChange!(opt.value, {
                        action: "assign",
                        schemaId,
                        schemaName,
                        removeRecordId: live?.id,
                      });
                    } else {
                      if (!planId) return;
                      createSchema.mutate({
                        broadband_plan_id: planId,
                        schema_id: schemaId,
                        schema_type: opt.value,
                      });
                    }
                  }}
                  onRemove={() => {
                    if (isEditBuffered) {
                      if (change?.action === "assign") {
                        onEditUndo!(opt.value);
                      } else if (live) {
                        onEditChange!(opt.value, { action: "remove", removeRecordId: live.id });
                      }
                    } else {
                      if (live) setDeleteTarget({ id: live.id, name: live.schema_name });
                    }
                  }}
                />
              );
            })}
          </div>
        </ScrollArea>
      )}

      <p className="text-xs text-muted-foreground">
        {effectiveAssigned} / {totalRequired} assigned
      </p>

      {!isEditBuffered && (
        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove schema assignment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will unlink{" "}
                <span className="font-semibold text-foreground">{deleteTarget?.name}</span> from
                this plan. The schema itself will not be deleted.
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
      )}
    </div>
  );
}
