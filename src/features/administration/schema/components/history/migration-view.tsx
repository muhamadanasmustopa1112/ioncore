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

export function SchemaMigrationView({ initialSchemaId = "" }: { initialSchemaId?: string }) {
  const [schemaId, setSchemaId] = useState(initialSchemaId);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [fromVersionId, setFromVersionId] = useState("");
  const [toVersionId, setToVersionId] = useState("");

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

  function handleMigrate() {
    migrate.mutate(
      { original_schema_version_id: fromVersionId, new_schema_version_id: toVersionId },
      {
        onSuccess: () => {
          toast.success(`Migration triggered for ${rows.length} customer(s).`);
          setTimeout(() => refetchCustomers(), 2000);
        },
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
