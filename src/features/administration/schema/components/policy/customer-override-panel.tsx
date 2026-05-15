"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
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
import { useCustomerSchemas } from "@/features/rule-schema";
import type { CustomerSchema } from "@/features/rule-schema";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function SchemaCard({ item }: { item: CustomerSchema }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start justify-between p-4 gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <RiUserLine className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm font-mono truncate">{item.customer_id}</span>
              {item.schema_type && (
                <Badge variant="info" appearance="light" className="text-[11px] px-2 capitalize">
                  {item.schema_type}
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-mono truncate">
              Schema: {item.schema_id}
            </p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              Created by {item.created_by}
              {item.updated_by && item.updated_by !== item.created_by
                ? ` · Updated by ${item.updated_by}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="h-7 text-xs px-3" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Collapse" : "View"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
            <span className="text-muted-foreground font-medium">Version ID</span>
            <span className="font-mono truncate">{item.schema_version_id || "—"}</span>
            <span className="text-muted-foreground font-medium">Rule</span>
            <span className="truncate">{item.rule || "—"}</span>
            <span className="text-muted-foreground font-medium">Created</span>
            <span>{item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</span>
            <span className="text-muted-foreground font-medium">Updated</span>
            <span>{item.updated_at ? new Date(item.updated_at).toLocaleString() : "—"}</span>
          </div>
          {item.overridden_content && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overridden Content</p>
              <pre className="text-xs bg-muted/40 rounded-lg px-3 py-2 overflow-auto max-h-48 whitespace-pre-wrap break-all">
                {JSON.stringify(item.overridden_content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CustomerOverridePanel() {
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

  const { data, isLoading, isError } = useCustomerSchemas({ page, size });
  const rows  = data?.data.customer_schemas ?? [];
  const rawMeta = data?.data.metadata;
  const total = rawMeta ? Number(rawMeta.total) || 0 : 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const filtered = search
    ? rows.filter((o) => {
        const q = search.toLowerCase();
        return o.customer_id.toLowerCase().includes(q) ||
          o.schema_id.toLowerCase().includes(q) ||
          o.schema_type.toLowerCase().includes(q);
      })
    : rows;

  const pgGroupStart = Math.floor((page - 1) / 5) * 5;
  const pgGroupEnd   = Math.min(pgGroupStart + 5, totalPages);
  const pgButtons    = Array.from({ length: pgGroupEnd - pgGroupStart }, (_, i) => pgGroupStart + i + 1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Customer-specific schema overrides. Applied on top of the base schema at runtime for
        customers with negotiated or special contract terms.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search customer, schema, type..." className="pl-9 h-9"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />Loading customer schemas...
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-destructive">Failed to load customer schemas.</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No customer schemas found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <SchemaCard key={item.id} item={item} />
          ))}
        </div>
      )}

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

    </div>
  );
}
