"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react";
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
import { useCustomerSchemasGrouped, useCustomerSchemaDiff } from "@/features/rule-schema";
import type { ContentDiffOp, CustomerGrouped, CustomerSchema } from "@/features/rule-schema";
import { useSchemaStore } from "../../store/schema";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const SCHEMA_TYPE_COLORS: Record<string, "info" | "success" | "warning" | "destructive" | "secondary"> = {
  WORK_ORDER: "info",
  SUSPENSION: "warning",
  ONBOARDING: "success",
  SERVICE: "secondary",
  COMMISSION: "destructive",
};

const OP_STYLE_CLASSES: Record<string, string> = {
  replace: "bg-blue-500/10 text-blue-600",
  add:     "bg-green-500/10 text-green-600",
  remove:  "bg-red-500/10 text-red-600",
};

function DiffRow({ op }: { op: ContentDiffOp }) {
  const { t } = useTranslation();
  const OP_STYLE: Record<string, { label: string; class: string }> = {
    replace: { label: t("administration.schema.overrideOpChanged"), class: OP_STYLE_CLASSES.replace },
    add:     { label: t("administration.schema.overrideOpAdded"),   class: OP_STYLE_CLASSES.add },
    remove:  { label: t("administration.schema.overrideOpRemoved"), class: OP_STYLE_CLASSES.remove },
  };
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
  const { t } = useTranslation();
  const { data, isFetching } = useCustomerSchemaDiff(schemaId, true);
  const ops = data?.data.diff ?? [];

  if (isFetching) return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
      <RiLoader4Line className="size-3.5 animate-spin" />{t("administration.schema.overrideDiffLoading")}
    </div>
  );
  if (ops.length === 0) return <p className="text-xs text-muted-foreground py-2">{t("administration.schema.overrideDiffNone")}</p>;
  return (
    <div className="space-y-1.5">
      {ops.map((op, i) => <DiffRow key={`${op.path}-${i}`} op={op} />)}
    </div>
  );
}

function SchemaRow({ schema }: { schema: CustomerSchema }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { openOverrideSheet } = useSchemaStore();

  return (
    <div className="border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between py-2.5 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant={SCHEMA_TYPE_COLORS[schema.schema_type] ?? "secondary"}
            appearance="light"
            className="text-[11px] px-2 capitalize shrink-0"
          >
            {schema.schema_type.replace(/_/g, " ").toLowerCase()}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">{schema.schema_name || "—"}</span>
          {schema.schema_version && (
            <span className="font-mono text-[10px] text-muted-foreground/70 shrink-0">{schema.schema_version}</span>
          )}
          {schema.is_overridden && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/10 text-yellow-600 shrink-0">
              {t("administration.schema.overrideTagOverridden")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="h-6 text-xs px-2"
            onClick={() => setExpanded((v) => !v)}>
            {expanded ? t("administration.schema.overrideDiffHide") : t("administration.schema.overrideDiffShow")}
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-xs px-2"
            onClick={() => openOverrideSheet(schema)}>
            {t("administration.schema.overrideBtn")}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">{t("administration.schema.overrideChanges")}</p>
          <DiffPanel schemaId={schema.id} />
        </div>
      )}
    </div>
  );
}

function CustomerCard({ group }: { group: CustomerGrouped }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const overriddenCount = group.customer_schemas.filter((s) => s.is_overridden).length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <RiUserLine className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/crm-and-sales/${group.customer_id}`}
              className="font-semibold text-sm truncate hover:underline text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {group.customer_name || group.customer_id}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" appearance="light" className="text-[11px] px-2">
            {group.customer_schema_count} {t("administration.schema.overrideSchemas")}{group.customer_schema_count !== 1 ? "s" : ""}
          </Badge>
          {overriddenCount > 0 && (
            <Badge variant="warning" appearance="light" className="text-[11px] px-2">
              {overriddenCount} {t("administration.schema.overrideOverridden")}
            </Badge>
          )}
          {expanded ? (
            <ChevronUpIcon className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && group.customer_schemas.length > 0 && (
        <div className="border-t border-border/60 px-4 pt-1 pb-2">
          {group.customer_schemas.map((schema) => (
            <SchemaRow key={schema.id} schema={schema} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomerOverridePanel() {
  const { t } = useTranslation();
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

  const { data, isLoading, isError } = useCustomerSchemasGrouped({
    page,
    size,
    search: search || undefined,
  });

  const groups     = data?.data ?? [];
  const meta       = data?.metadata;
  const total      = meta ? Number(meta.total) || 0 : 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const pgGroupStart = Math.floor((page - 1) / 5) * 5;
  const pgGroupEnd   = Math.min(pgGroupStart + 5, totalPages);
  const pgButtons    = Array.from({ length: pgGroupEnd - pgGroupStart }, (_, i) => pgGroupStart + i + 1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("administration.schema.overrideDesc")}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("administration.schema.overrideSearchPlaceholder")}
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />
          {t("administration.schema.overrideLoading")}
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-destructive">{t("administration.schema.overrideError")}</p>
      ) : groups.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("administration.schema.overrideEmpty")}</p>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <CustomerCard key={group.customer_id} group={group} />
          ))}
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("administration.schema.overrideRowsPerPage")}</span>
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
              {(page - 1) * size + 1}–{Math.min(page * size, total)} {t("administration.schema.overrideOf")} {total}
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
                    onClick={() => setPage(p)}>{p}
                  </Button>
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
