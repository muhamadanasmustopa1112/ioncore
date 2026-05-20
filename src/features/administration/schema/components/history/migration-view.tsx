"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import { RiExchangeLine, RiLoader4Line, RiRefreshLine } from "@remixicon/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useSchemas,
  useSchemaVersions,
  useCustomerSchemasByVersion,
  useMigrateCustomerSchemas,
} from "@/features/rule-schema";
import type { CustomerSchema } from "@/features/rule-schema";

function CustomerRow({ item }: { item: CustomerSchema }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <div className="min-w-0">
        <span className="text-sm font-medium block truncate">{item.customer_name ?? item.customer_id}</span>
        <span className="text-xs text-muted-foreground font-mono">
          {item.customer_id.slice(0, 8)}… · {item.schema_type}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.is_overridden && (
          <Badge variant="warning" appearance="light" className="text-[10px] px-1.5">
            Overridden
          </Badge>
        )}
        <span className="font-mono text-[10px] text-muted-foreground">
          {item.schema_version_id.slice(0, 8)}…
        </span>
      </div>
    </div>
  );
}

// ── Client-side diff ────────────────────────────────────────────────────────

type DiffRow =
  | { kind: "added";    label: string; value: string }
  | { kind: "removed";  label: string; value: string }
  | { kind: "modified"; label: string; from: string; to: string };

function fmt(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length === 0 ? "(empty)" : `${v.length} item(s)`;
  if (isPlainObject(v)) {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => `${toLabel(k)}: ${String(val)}`)
      .join(" · ");
  }
  return String(v);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function toLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPath(path: string): string {
  return path
    .replace(/\["([^"]+)"\]/g, " › $1")
    .replace(/\[(\d+)\]/g, (_, n) => ` › Item ${parseInt(n) + 1}`)
    .split(".")
    .map((seg) => {
      const clean = seg.replace(/ › /g, "|||");
      return clean.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\|\|\|/g, " › ");
    })
    .join(" › ");
}

const ITEM_ID_FIELDS = ["document_id", "step_id", "item_id", "id", "day", "key", "code"];
const ITEM_LABEL_FIELDS = ["document_name", "step_name", "item_label", "name", "title", "label", "day"];

function findIdField(arr: unknown[]): string | null {
  const sample = arr.find(isPlainObject);
  if (!sample) return null;
  return ITEM_ID_FIELDS.find((f) => f in sample) ?? null;
}

function getItemLabel(item: Record<string, unknown>): string {
  for (const f of ITEM_LABEL_FIELDS) {
    if (typeof item[f] === "string") return item[f] as string;
  }
  for (const f of ITEM_ID_FIELDS) {
    if (item[f]) return String(item[f]);
  }
  return "?";
}

function deepDiff(from: unknown, to: unknown, prefix = ""): DiffRow[] {
  const rows: DiffRow[] = [];

  if (Array.isArray(from) && Array.isArray(to)) {
    const idField = findIdField([...from, ...to]);
    if (idField) {
      const fromMap = new Map((from as Record<string, unknown>[]).map((x) => [x[idField], x]));
      const toMap   = new Map((to   as Record<string, unknown>[]).map((x) => [x[idField], x]));
      toMap.forEach((item, id) => {
        if (!fromMap.has(id)) {
          rows.push({ kind: "added", label: `${prefix}["${getItemLabel(item)}"]`, value: fmt(item) });
        }
      });
      fromMap.forEach((item, id) => {
        if (!toMap.has(id)) {
          rows.push({ kind: "removed", label: `${prefix}["${getItemLabel(item)}"]`, value: fmt(item) });
        }
      });
      fromMap.forEach((fromItem, id) => {
        const toItem = toMap.get(id);
        if (!toItem) return;
        rows.push(...deepDiff(fromItem, toItem, `${prefix}["${getItemLabel(fromItem)}"]`));
      });
    } else {
      const len = Math.max(from.length, to.length);
      for (let i = 0; i < len; i++) {
        if (i >= from.length) rows.push({ kind: "added",   label: `${prefix}[${i}]`, value: fmt(to[i]) });
        else if (i >= to.length) rows.push({ kind: "removed", label: `${prefix}[${i}]`, value: fmt(from[i]) });
        else rows.push(...deepDiff(from[i], to[i], `${prefix}[${i}]`));
      }
    }
    return rows;
  }

  if (isPlainObject(from) && isPlainObject(to)) {
    const allKeys = Array.from(new Set([...Object.keys(from), ...Object.keys(to)]));
    for (const k of allKeys) {
      const label = prefix ? `${prefix}.${k}` : k;
      if (!(k in from)) rows.push({ kind: "added",   label, value: fmt(to[k]) });
      else if (!(k in to)) rows.push({ kind: "removed", label, value: fmt(from[k]) });
      else rows.push(...deepDiff(from[k], to[k], label));
    }
    return rows;
  }

  if (JSON.stringify(from) !== JSON.stringify(to)) {
    rows.push({ kind: "modified", label: prefix, from: fmt(from), to: fmt(to) });
  }
  return rows;
}

function computeDiff(
  fromContent: Record<string, unknown>,
  toContent: Record<string, unknown>,
): DiffRow[] {
  return deepDiff(fromContent, toContent);
}

// ── Diff row renderers ───────────────────────────────────────────────────────

function AddedRow({ row }: { row: Extract<DiffRow, { kind: "added" }> }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2">
      <span className="text-emerald-600 font-bold text-xs w-4 shrink-0 mt-0.5">+</span>
      <div className="min-w-0">
        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{formatPath(row.label)}</span>
        <span className="text-xs text-emerald-600 dark:text-emerald-300 ml-2">{row.value}</span>
      </div>
    </div>
  );
}

function RemovedRow({ row }: { row: Extract<DiffRow, { kind: "removed" }> }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2">
      <span className="text-destructive font-bold text-xs w-4 shrink-0 mt-0.5">−</span>
      <div className="min-w-0">
        <span className="text-xs text-red-700 dark:text-red-400 font-semibold">{formatPath(row.label)}</span>
        <span className="text-xs text-red-600 dark:text-red-300 ml-2 line-through">{row.value}</span>
      </div>
    </div>
  );
}

function ModifiedRow({ row }: { row: Extract<DiffRow, { kind: "modified" }> }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
      <span className="text-amber-500 font-bold text-xs w-4 shrink-0 mt-0.5">~</span>
      <div className="min-w-0 space-y-0.5">
        <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block">{formatPath(row.label)}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-xs text-red-600 dark:text-red-400 line-through">{row.from}</span>
          <span className="text-muted-foreground text-xs">→</span>
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{row.to}</span>
        </div>
      </div>
    </div>
  );
}

// ── Confirm dialog ───────────────────────────────────────────────────────────

function MigrationConfirmDialog({
  open,
  onOpenChange,
  fromVersion,
  toVersion,
  fromContent,
  toContent,
  customerCount,
  isPending,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fromVersion: string;
  toVersion: string;
  fromContent: Record<string, unknown> | null;
  toContent: Record<string, unknown> | null;
  customerCount: number;
  isPending: boolean;
  onConfirm: () => void;
}) {
  const rows = fromContent && toContent ? computeDiff(fromContent, toContent) : [];
  const added    = rows.filter((r) => r.kind === "added")    as Extract<DiffRow, { kind: "added" }>[];
  const removed  = rows.filter((r) => r.kind === "removed")  as Extract<DiffRow, { kind: "removed" }>[];
  const modified = rows.filter((r) => r.kind === "modified") as Extract<DiffRow, { kind: "modified" }>[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <RiExchangeLine className="size-4 text-primary" />
            Confirm Migration
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {customerCount} customer(s) will move from{" "}
            <span className="font-mono font-semibold text-foreground">{fromVersion}</span>
            {" → "}
            <span className="font-mono font-semibold text-foreground">{toVersion}</span>.
            Each migration is logged to the audit trail.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {rows.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">
              No differences detected between versions.
            </p>
          ) : (
            <div className="space-y-4">
              {added.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    Added ({added.length})
                  </p>
                  <div className="space-y-1.5">
                    {added.map((r, i) => <AddedRow key={i} row={r} />)}
                  </div>
                </div>
              )}
              {removed.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                    Removed ({removed.length})
                  </p>
                  <div className="space-y-1.5">
                    {removed.map((r, i) => <RemovedRow key={i} row={r} />)}
                  </div>
                </div>
              )}
              {modified.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                    Modified ({modified.length})
                  </p>
                  <div className="space-y-1.5">
                    {modified.map((r, i) => <ModifiedRow key={i} row={r} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="text-emerald-600 font-bold">+</span> Added</span>
            <span className="text-border mx-1">·</span>
            <span className="inline-flex items-center gap-1"><span className="text-destructive font-bold">−</span> Removed</span>
            <span className="text-border mx-1">·</span>
            <span className="inline-flex items-center gap-1"><span className="text-amber-500 font-bold">~</span> Modified</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" disabled={isPending} onClick={onConfirm}>
              <RiExchangeLine className="size-4" />
              {isPending ? "Migrating…" : `Migrate ${customerCount} Customer(s)`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SchemaMigrationView({ initialSchemaId = "" }: { initialSchemaId?: string }) {
  const [schemaId, setSchemaId] = useState(initialSchemaId);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [fromVersionId, setFromVersionId] = useState("");
  const [toVersionId, setToVersionId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // nuqs hydrates URL params after mount — sync once the value becomes available
  useEffect(() => {
    if (initialSchemaId && !schemaId) {
      setSchemaId(initialSchemaId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSchemaId]);

  const { data: schemasEnvelope } = useSchemas({ hasSchemaPublished: true, size: 100 });
  const schemas = schemasEnvelope?.data?.schemas ?? [];

  const { data: versionsEnvelope } = useSchemaVersions(schemaId);
  // Sorted descending: index 0 = latest version
  const allVersions = [...(versionsEnvelope?.data?.schema_versions ?? [])].sort((a, b) => {
    const aDate = a.published_at ?? a.updated_at ?? a.created_at;
    const bDate = b.published_at ?? b.updated_at ?? b.created_at;
    return bDate.localeCompare(aDate);
  });

  const fromOptions = allVersions;
  const toOptions = allVersions.filter((v) => v.id !== fromVersionId);

  const { data: customersEnvelope, isLoading: customersLoading } =
    useCustomerSchemasByVersion(fromVersionId);
  const rows = customersEnvelope?.data?.customer_schemas ?? [];
  const total = customersEnvelope?.data?.metadata
    ? Number(customersEnvelope.data.metadata.total)
    : 0;

  const migrate = useMigrateCustomerSchemas();
  const qc = useQueryClient();

  function refetchCustomers() {
    qc.invalidateQueries({ queryKey: ["rule-schema"] });
  }

  useEffect(() => {
    if (!schemaId || fromVersionId) return;
    if (allVersions.length > 0) setFromVersionId(allVersions[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaId, allVersions.length]);

  function handleSchemaChange(id: string) {
    setSchemaId(id);
    setFromVersionId("");
    setToVersionId("");
  }

  function handleFromChange(id: string) {
    setFromVersionId(id);
    setToVersionId("");
  }

  function executeMigrate() {
    migrate.mutate(
      { original_schema_version_id: fromVersionId, new_schema_version_id: toVersionId },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          toast.success(`Migration triggered for ${rows.length} customer(s).`);
          setTimeout(() => refetchCustomers(), 2000);
        },
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Migration failed"),
      },
    );
  }

  const fromVersionObj = allVersions.find((v) => v.id === fromVersionId);
  const toVersionObj   = allVersions.find((v) => v.id === toVersionId);
  const fromVersion    = fromVersionObj?.version ?? fromVersionId;
  const toVersion      = toVersionObj?.version ?? toVersionId;
  const fromContent    = (fromVersionObj?.content as Record<string, unknown> | undefined) ?? null;
  const toContent      = (toVersionObj?.content   as Record<string, unknown> | undefined) ?? null;
  const canMigrate     = !!fromVersionId && !!toVersionId && rows.length > 0;

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Migrate customers from one schema version to another. Select a schema, choose the source
        and target versions, then confirm.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Schema</Label>
          <Popover open={schemaOpen} onOpenChange={setSchemaOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                <span className="truncate">
                  {schemaId
                    ? schemas.find((s) => s.id === schemaId)?.name ?? "Select schema…"
                    : "Select schema…"}
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]" align="start">
              <Command>
                <CommandInput placeholder="Search schema…" />
                <CommandList>
                  <CommandEmpty>No schemas found.</CommandEmpty>
                  <CommandGroup>
                    {schemas.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={s.name}
                        onSelect={() => { handleSchemaChange(s.id); setSchemaOpen(false); }}
                      >
                        <span className="truncate flex-1">{s.name}</span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground uppercase shrink-0">
                          {s.schema_type}
                        </span>
                        {s.latest_published_version && (
                          <span className="ml-1 text-[10px] text-muted-foreground shrink-0">
                            · {s.latest_published_version}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">From Version</Label>
          <Select value={fromVersionId} onValueChange={handleFromChange} disabled={!schemaId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select source version…" />
            </SelectTrigger>
            <SelectContent>
              {fromOptions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">To Version</Label>
          <Select value={toVersionId} onValueChange={setToVersionId} disabled={!fromVersionId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select target version…" />
            </SelectTrigger>
            <SelectContent>
              {toOptions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {fromVersionId && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Affected Customers
            </span>
            {!customersLoading && (
              <Badge variant="info" appearance="light" className="text-[10px]">
                {total}
              </Badge>
            )}
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground gap-1"
              disabled={customersLoading}
              onClick={refetchCustomers}
            >
              <RiRefreshLine className={`size-3.5 ${customersLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {customersLoading ? (
            <div className="flex items-center gap-2 py-8 px-4 text-sm text-muted-foreground">
              <RiLoader4Line className="size-4 animate-spin" />
              Loading customers…
            </div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No customers found on this schema version.
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {rows.map((item) => (
                <CustomerRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {canMigrate && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setConfirmOpen(true)}>
            <RiExchangeLine className="size-4" />
            {`Migrate ${rows.length} Customer(s)`}
          </Button>
        </div>
      )}

      <MigrationConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        fromVersion={fromVersion}
        toVersion={toVersion}
        fromContent={fromContent}
        toContent={toContent}
        customerCount={rows.length}
        isPending={migrate.isPending}
        onConfirm={executeMigrate}
      />
    </div>
  );
}
