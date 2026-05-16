"use client";

import { useState, useEffect } from "react";
import { RiExchangeLine, RiLoader4Line } from "@remixicon/react";
import { toast } from "sonner";
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

export function SchemaMigrationView() {
  const [schemaId, setSchemaId] = useState("");
  const [fromVersionId, setFromVersionId] = useState("");
  const [toVersionId, setToVersionId] = useState("");

  const { data: schemasEnvelope } = useSchemas({ hasSchemaPublished: true });
  const schemas = schemasEnvelope?.data?.schemas ?? [];

  const { data: versionsEnvelope } = useSchemaVersions(schemaId);
  // Sorted descending: index 0 = latest version
  const allVersions = [...(versionsEnvelope?.data?.schema_versions ?? [])].sort((a, b) => {
    const aDate = a.published_at ?? a.updated_at ?? a.created_at;
    const bDate = b.published_at ?? b.updated_at ?? b.created_at;
    return bDate.localeCompare(aDate);
  });

  // From: skip index 0 (latest); To: only versions newer than selected From (index < fromIndex)
  const fromOptions = allVersions.slice(1);
  const fromIndex = allVersions.findIndex((v) => v.id === fromVersionId);
  const toOptions = fromIndex > 0 ? allVersions.slice(0, fromIndex) : [];

  const { data: customersEnvelope, isLoading: customersLoading } =
    useCustomerSchemasByVersion(fromVersionId);
  const rows = customersEnvelope?.data?.customer_schemas ?? [];
  const total = customersEnvelope?.data?.metadata
    ? Number(customersEnvelope.data.metadata.total)
    : 0;

  const migrate = useMigrateCustomerSchemas();

  // Auto-select the first fromOption once versions load
  useEffect(() => {
    if (!schemaId || fromVersionId) return;
    if (fromOptions.length > 0) setFromVersionId(fromOptions[0].id);
  }, [schemaId, fromOptions, fromVersionId]);

  function handleSchemaChange(id: string) {
    setSchemaId(id);
    setFromVersionId("");
    setToVersionId("");
  }

  function handleFromChange(id: string) {
    setFromVersionId(id);
    setToVersionId("");
  }

  function handleMigrate() {
    migrate.mutate(
      { original_schema_version_id: fromVersionId, new_schema_version_id: toVersionId },
      {
        onSuccess: () => toast.success(`Migration successful for ${rows.length} customer(s)`),
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Migration failed"),
      },
    );
  }

  const canMigrate = !!fromVersionId && !!toVersionId && rows.length > 0;

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Migrate customers from one schema version to another. Select a schema, choose the source
        and target versions, then confirm.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Schema</Label>
          <Select value={schemaId} onValueChange={handleSchemaChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select schema…" />
            </SelectTrigger>
            <SelectContent>
              {schemas.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                  <span className="ml-1.5 text-[10px] text-muted-foreground uppercase">
                    {s.schema_type}
                  </span>
                  {s.latest_published_version && (
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      · {s.latest_published_version}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <>
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 space-y-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              ⚠ Confirm Migration
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {rows.length} customer(s) will be migrated to the new schema version. Each migration
              is logged to the audit trail.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="primary" disabled={migrate.isPending} onClick={handleMigrate}>
              <RiExchangeLine className="size-4" />
              {migrate.isPending ? "Migrating…" : `Migrate ${rows.length} Customer(s)`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
