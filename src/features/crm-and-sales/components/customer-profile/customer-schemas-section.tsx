"use client";

import { useState, useEffect } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCustomerSchemasByCustomer,
  useCustomerSchemaDiff,
  useUpdateCustomerSchema,
} from "@/features/rule-schema";
import type { ContentDiffOp, CustomerSchema } from "@/features/rule-schema";

// ── Diff row ─────────────────────────────────────────────

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

// ── Diff panel (lazy-loaded) ─────────────────────────────

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

// ── Override sheet ───────────────────────────────────────

interface OverrideSheetProps {
  schema: CustomerSchema | null;
  onOpenChange: (v: boolean) => void;
  customerId: string;
}

function OverrideSheet({ schema, onOpenChange, customerId }: OverrideSheetProps) {
  const [json, setJson] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (schema) {
      setJson(JSON.stringify(schema.overridden_content, null, 2));
      setJsonError("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema?.id]); // intentionally only schema.id — re-populate only when a different schema is opened
  const update = useUpdateCustomerSchema();

  const handleJsonChange = (val: string) => {
    setJson(val);
    try { JSON.parse(val); setJsonError(""); }
    catch { setJsonError("Invalid JSON"); }
  };

  const handleSubmit = () => {
    if (!schema || jsonError) return;
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(json); }
    catch { setJsonError("Invalid JSON"); return; }

    update.mutate(
      { id: schema.id, payload: { overridden_content: parsed } },
      {
        onSuccess: () => {
          toast.success("Schema override saved");
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : "Failed to save override");
        },
      },
    );
  };

  return (
    <Sheet open={!!schema} onOpenChange={onOpenChange}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[560px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">Override Schema</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 overflow-auto px-5 py-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info" appearance="light" className="capitalize text-xs">
              {schema?.schema_type?.replace(/_/g, " ").toLowerCase()}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground truncate">{schema?.schema_id}</span>
          </div>

          <div className="space-y-1.5">
            <Label>Original Content</Label>
            <pre className="text-xs bg-muted/40 rounded-lg px-3 py-2.5 overflow-auto max-h-48 whitespace-pre-wrap break-all font-mono">
              {schema ? JSON.stringify(schema.original_content, null, 2) : ""}
            </pre>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Overridden Content</Label>
              {jsonError && <span className="text-xs text-destructive">{jsonError}</span>}
            </div>
            <Textarea
              className="font-mono text-xs min-h-44 resize-y"
              value={json}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
            />
          </div>
        </SheetBody>
        <SheetFooter className="border-t flex-row gap-2.5 p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <div className="flex-1" />
          <Button
            variant="primary"
            className="font-semibold"
            onClick={handleSubmit}
            disabled={!!jsonError || update.isPending}
          >
            {update.isPending ? "Saving…" : "Save Override"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Schema row ───────────────────────────────────────────

function SchemaRow({ item, onOverride }: { item: CustomerSchema; onOverride: (item: CustomerSchema) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between py-3 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="info" appearance="light" className="text-[11px] px-2 capitalize shrink-0">
            {item.schema_type.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground truncate">{item.schema_id}</span>
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

// ── Section card ─────────────────────────────────────────

export function CustomerSchemasSection({ customerId }: { customerId: string }) {
  const [overrideTarget, setOverrideTarget] = useState<CustomerSchema | null>(null);
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
              <SchemaRow key={item.id} item={item} onOverride={setOverrideTarget} />
            ))
          )}
        </CardContent>
      </Card>

      <OverrideSheet
        schema={overrideTarget}
        customerId={customerId}
        onOpenChange={(open) => { if (!open) setOverrideTarget(null); }}
      />
    </>
  );
}
