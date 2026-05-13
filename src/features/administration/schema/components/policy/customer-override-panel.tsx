"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  RiAddLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCustomerOverrideDiff,
  useCustomerOverrides,
} from "@/features/rule-schema";
import type {
  CustomerOverrideSchema,
  OverriddenField,
  OverrideDiffStatus,
} from "@/features/rule-schema";
import { CustomerOverrideFormSheet } from "./customer-override-form-sheet";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const DIFF_BADGE: Record<
  OverrideDiffStatus,
  { variant: "info" | "success" | "destructive" | "warning"; label: string }
> = {
  Changed: { variant: "info", label: "Changed" },
  Added: { variant: "success", label: "Added" },
  Removed: { variant: "destructive", label: "Removed" },
};

function DiffRow({ field }: { field: OverriddenField }) {
  const cfg = DIFF_BADGE[field.status] ?? { variant: "warning" as const, label: String(field.status) };
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-lg bg-muted/40 px-3 py-2">
      <span className="text-xs font-mono text-muted-foreground truncate">{field.path}</span>
      <span className="text-xs line-through text-muted-foreground">{field.from ?? "—"}</span>
      <span className="text-xs font-medium text-foreground">{field.to ?? "—"}</span>
      <Badge variant={cfg.variant} appearance="light" className="text-[11px] px-2">{cfg.label}</Badge>
    </div>
  );
}

function OverrideCard({ override }: { override: CustomerOverrideSchema }) {
  const [expanded, setExpanded] = useState(false);
  const { data: diffEnv, isFetching: diffLoading } = useCustomerOverrideDiff(override.id, expanded);
  const diff = diffEnv?.data;
  const fieldCount = diff?.overridden_fields.length ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between p-4 gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <RiUserLine className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{override.customer_name}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{override.schema_name}</span>
              <RiArrowRightLine className="size-3" />
              <span className="font-medium text-foreground">{override.baseline_schema_name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              Created by {override.created_by}
              {override.updated_by && override.updated_by !== override.created_by
                ? ` · Updated by ${override.updated_by}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {expanded && (
            <Badge variant="info" appearance="light" className="text-xs">
              {fieldCount} field{fieldCount !== 1 ? "s" : ""}
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs px-3" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Collapse" : "View"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overridden Fields</p>
          {diffLoading && !diff ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiLoader4Line className="size-4 animate-spin" />Loading diff...
            </div>
          ) : !diff || diff.overridden_fields.length === 0 ? (
            <p className="text-xs text-muted-foreground">No differences.</p>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{diff.baseline_label}</span>
                <span className="font-medium text-foreground">{diff.baseline_version_name}</span>
                <RiArrowRightLine className="size-3" />
                <span>{diff.override_label}</span>
                <span className="font-medium text-foreground">{diff.override_version_name}</span>
              </div>
              <div className="space-y-2">
                {diff.overridden_fields.map((field, idx) => (
                  <DiffRow key={`${field.path}-${idx}`} field={field} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function CustomerOverridePanel() {
  const [createOpen, setCreateOpen] = useState(false);

  const [params, setParams] = useQueryStates({
    co_page:   parseAsInteger.withDefault(1),
    co_size:   parseAsInteger.withDefault(10),
    co_search: parseAsString,
  });

  const page   = params.co_page;
  const size   = params.co_size;
  const search = params.co_search ?? "";

  function setPage(p: number) { setParams({ co_page: p }); }
  function setSize(s: number) { setParams({ co_size: s, co_page: 1 }); }
  function setSearch(v: string) { setParams({ co_search: v || null, co_page: 1 }); }

  const { data, isLoading, isError } = useCustomerOverrides({ page, size });
  const rows  = data?.data.customer_override_schemas ?? [];
  const total = data?.data.metadata?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const filtered = search
    ? rows.filter((o) => {
        const q = search.toLowerCase();
        return o.customer_name.toLowerCase().includes(q) ||
          o.schema_name.toLowerCase().includes(q) ||
          o.baseline_schema_name.toLowerCase().includes(q);
      })
    : rows;

  const pgGroupStart = Math.floor((page - 1) / 5) * 5;
  const pgGroupEnd   = Math.min(pgGroupStart + 5, totalPages);
  const pgButtons    = Array.from({ length: pgGroupEnd - pgGroupStart }, (_, i) => pgGroupStart + i + 1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Individual schema attribute overrides for customers with negotiated or special contract terms.
        Overrides are applied on top of the customer&apos;s assigned base schema at runtime.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search customer or schema..." className="pl-9 h-9"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 font-medium w-full sm:w-auto"
          onClick={() => setCreateOpen(true)}>
          <RiAddLine className="size-4 mr-1.5" />New Override
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />Loading overrides...
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-destructive">Failed to load overrides.</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No overrides found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((override) => (
            <OverrideCard key={override.id} override={override} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page</span>
            <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
              <SelectTrigger className="w-fit" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[50px]">
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground text-nowrap">
              {(page - 1) * size + 1} - {Math.min(page * size, total)} of {total}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button size="sm" mode="icon" variant="ghost" className="size-7 p-0"
                  disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                {pgGroupStart > 0 && (
                  <Button size="sm" mode="icon" variant="ghost" className="size-7 p-0 text-sm"
                    onClick={() => setPage(pgGroupStart)}>...</Button>
                )}
                {pgButtons.map((p) => (
                  <Button key={p} size="sm" mode="icon" variant="ghost"
                    className={`size-7 p-0 text-sm ${page === p ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
                    onClick={() => setPage(p)}>{p}</Button>
                ))}
                {pgGroupEnd < totalPages && (
                  <Button size="sm" mode="icon" variant="ghost" className="size-7 p-0 text-sm"
                    onClick={() => setPage(pgGroupEnd + 1)}>...</Button>
                )}
                <Button size="sm" mode="icon" variant="ghost" className="size-7 p-0"
                  disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <CustomerOverrideFormSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
