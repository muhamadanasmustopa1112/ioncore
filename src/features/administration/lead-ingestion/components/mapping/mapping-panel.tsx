"use client";

import { useEffect, useMemo, useState } from "react";
import { RiAddLine, RiDeleteBin7Line, RiPlayLine, RiSendPlane2Line } from "@remixicon/react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateLead } from "@/features/leads/api/leads-queries";
import { useLeadIngestionStore } from "../../store/lead-ingestion";
import {
  ExternalSource,
  MAPPABLE_FIELDS,
  MappableLeadField,
  MappingRow,
  REQUIRED_LEAD_FIELDS,
} from "../../types/lead-ingestion";
import { applyMapping } from "../../util/apply-mapping";
import type { CreateLeadPayload } from "@/features/leads/types/leads-api";

const SAMPLE_PAYLOAD = `{
  "full_name": "Budi Santoso",
  "phone": "+6281234567890",
  "plan_type": "broadband"
}`;

export function MappingPanel({ source }: { source: ExternalSource }) {
  const mappings = useLeadIngestionStore((s) => s.mappings);
  const saveMapping = useLeadIngestionStore((s) => s.saveMapping);
  const [rows, setRows] = useState<MappingRow[]>([]);
  const [payloadText, setPayloadText] = useState(SAMPLE_PAYLOAD);
  const [resolved, setResolved] = useState<CreateLeadPayload | null>(null);
  const [missing, setMissing] = useState<MappableLeadField[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const createLead = useCreateLead();

  useEffect(() => {
    setRows(mappings[source.id]?.rows ?? []);
    setResolved(null);
    setMissing([]);
    setParseError(null);
  }, [source.id, mappings]);

  const usedInternalFields = useMemo(() => new Set(rows.map((r) => r.internalField)), [rows]);

  const addRow = () => {
    const available = MAPPABLE_FIELDS.find((f) => !usedInternalFields.has(f)) ?? "lead_name";
    setRows((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, externalField: "", internalField: available, defaultValue: "" },
    ]);
  };

  const updateRow = (id: string, patch: Partial<MappingRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSaveMapping = () => {
    saveMapping(source.id, rows);
    toast.success("Mapping saved");
  };

  const runMapping = () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(payloadText) as Record<string, unknown>;
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
      setResolved(null);
      setMissing([]);
      return;
    }
    setParseError(null);
    const result = applyMapping({ sourceId: source.id, rows }, source, parsed);
    if (result.ok) {
      setResolved(result.lead);
      setMissing([]);
    } else {
      setResolved(null);
      setMissing(result.missing);
    }
  };

  const sendIngest = () => {
    if (!resolved) return;
    createLead.mutate(resolved, {
      onSuccess: (res) => {
        toast.success(`Lead ingested (id ${res.data?.id ?? "—"})`);
      },
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* Mapping rows */}
          <section className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h3 className="text-sm font-semibold">Field Mapping</h3>
              <Button variant="outline" size="sm" onClick={addRow}>
                <RiAddLine className="size-4" />
                Add Row
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Required lead fields: {REQUIRED_LEAD_FIELDS.join(", ")}. Source defaults fill any field
              that has no mapping row.
            </p>

            {rows.length === 0 && (
              <div className="rounded-md border border-dashed border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
                No mapping rows. Source defaults will populate all required fields.
              </div>
            )}

            <div className="space-y-2">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 gap-2 rounded-md border border-border/50 p-2"
                >
                  <div className="col-span-4">
                    <Label className="text-[10px] uppercase text-muted-foreground">External Field</Label>
                    <Input
                      placeholder="e.g. full_name"
                      value={row.externalField}
                      onChange={(e) => updateRow(row.id, { externalField: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label className="text-[10px] uppercase text-muted-foreground">Internal Field</Label>
                    <Select
                      value={row.internalField}
                      onValueChange={(v) => updateRow(row.id, { internalField: v as MappableLeadField })}
                    >
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MAPPABLE_FIELDS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Label className="text-[10px] uppercase text-muted-foreground">Default</Label>
                    <Input
                      placeholder="(optional)"
                      value={row.defaultValue}
                      onChange={(e) => updateRow(row.id, { defaultValue: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-end">
                    <Button mode="icon" size="sm" variant="ghost" onClick={() => removeRow(row.id)}>
                      <RiDeleteBin7Line className="size-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <Button size="sm" variant="primary" onClick={handleSaveMapping}>
                Save Mapping
              </Button>
            </div>
          </section>

          {/* Test ingest */}
          <section className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h3 className="text-sm font-semibold">Test Ingest</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={runMapping}>
                  <RiPlayLine className="size-4" />
                  Run
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={sendIngest}
                  disabled={!resolved || createLead.isPending}
                >
                  <RiSendPlane2Line className="size-4" />
                  {createLead.isPending ? "Sending…" : "Send"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Sample Payload (JSON)</Label>
              <Textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="min-h-[140px] font-mono text-xs"
              />
              {parseError && (
                <p className="text-xs text-red-600">JSON error: {parseError}</p>
              )}
            </div>

            {missing.length > 0 && (
              <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
                Missing required fields: {missing.join(", ")}. Add a mapping row or set a source default.
              </div>
            )}

            {resolved && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Resolved Lead Payload</Label>
                <pre className="rounded-md border border-border/50 bg-muted/40 p-3 text-xs font-mono overflow-auto">
{JSON.stringify(resolved, null, 2)}
                </pre>
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
