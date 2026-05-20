"use client";

import { useState } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCustomerSchemasByCustomer,
  useCustomerSchemaDiff,
} from "@/features/rule-schema";
import type { ContentDiffOp, CustomerSchema } from "@/features/rule-schema";
import { useSchemaStore } from "@/features/administration/schema/store/schema";
import { SchemaFormSheet } from "@/features/administration/schema/components/schema-form-sheet";

const SCHEMA_TYPE_COLORS: Record<string, "info" | "success" | "warning" | "destructive" | "secondary"> = {
  WORK_ORDER: "info",
  SUSPENSION: "warning",
  ONBOARDING: "success",
  SERVICE: "secondary",
  COMMISSION: "destructive",
};

const OP_STYLE: Record<string, { label: string; class: string }> = {
  replace: { label: "Changed", class: "bg-blue-500/10 text-blue-600" },
  add:     { label: "Added",   class: "bg-green-500/10 text-green-600" },
  remove:  { label: "Removed", class: "bg-red-500/10 text-red-600" },
};

function DiffRow({ op }: { op: ContentDiffOp }) {
  const style = OP_STYLE[op.op] ?? { label: op.op, class: "bg-muted text-muted-foreground" };
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-lg bg-muted/40 px-3 py-2 text-xs">
      <span className="font-mono text-muted-foreground truncate">{op.path}</span>
      {op.old_value !== undefined && (
        <span className="line-through text-muted-foreground">{String(op.old_value)}</span>
      )}
      {op.value !== undefined && (
        <span className="font-medium">{String(op.value)}</span>
      )}
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${style.class}`}>{style.label}</span>
    </div>
  );
}

function DiffPanel({ schemaId }: { schemaId: string }) {
  const { data, isFetching } = useCustomerSchemaDiff(schemaId, true);
  const ops = data?.data.diff ?? [];

  if (isFetching) return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
      <RiLoader4Line className="size-3.5 animate-spin" />Loading diff…
    </div>
  );
  if (ops.length === 0) return <p className="text-xs text-muted-foreground py-2">No differences.</p>;
  return (
    <div className="space-y-1.5">
      {ops.map((op, i) => <DiffRow key={`${op.path}-${i}`} op={op} />)}
    </div>
  );
}

function SchemaRow({ item, onOverride }: { item: CustomerSchema; onOverride: (item: CustomerSchema) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between py-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant={SCHEMA_TYPE_COLORS[item.schema_type] ?? "secondary"}
            appearance="light"
            className="text-[11px] px-2 capitalize shrink-0"
          >
            {item.schema_type.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">{item.schema_name ?? item.schema_id}</span>
          {item.schema_version && (
            <span className="font-mono text-[10px] text-muted-foreground/70 shrink-0">{item.schema_version}</span>
          )}
          {item.is_overridden && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/10 text-yellow-600 shrink-0">
              Overridden
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide" : "Diff"}
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-xs px-2" onClick={() => onOverride(item)}>
            Override
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Changes</p>
          <DiffPanel schemaId={item.id} />
        </div>
      )}
    </div>
  );
}

export function CustomerSchemasSection({ customerId }: { customerId: string }) {
  const { openOverrideSheet } = useSchemaStore();
  const { data, isLoading, isError } = useCustomerSchemasByCustomer(customerId);
  const items = data?.data ?? [];

  return (
    <>
      <Card>
        <CardHeader className="border-b py-3 px-6">
          <CardTitle className="text-sm">Schema Overrides</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pt-1 pb-4">
          {isLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <RiLoader4Line className="size-4 animate-spin" />Loading schemas…
            </div>
          ) : isError ? (
            <p className="py-6 text-sm text-destructive">Failed to load schemas.</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">No schema overrides.</p>
          ) : (
            items.map((item) => (
              <SchemaRow key={item.id} item={item} onOverride={openOverrideSheet} />
            ))
          )}
        </CardContent>
      </Card>

      <SchemaFormSheet />
    </>
  );
}
