"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiSearchLine,
  RiWifiLine,
} from "@remixicon/react";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBroadbandPlanSchemas,
  useDeleteBroadbandPlanSchema,
} from "@/features/rule-schema";
import { useAdminBroadbandPlans } from "@/features/products/api/products-queries";
import { BroadbandPlanSchemaFormSheet } from "./broadband-plan-schema-form-sheet";

const SCHEMA_TYPE_COLORS: Record<string, string> = {
  BILLING: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  ONBOARDING: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  SERVICE: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
  COMMISSION: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  SUSPENSION: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  WORK_ORDER: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400",
};

function schemaTypeColor(type: string) {
  return SCHEMA_TYPE_COLORS[type.toUpperCase()] ?? "bg-muted text-muted-foreground";
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function BroadbandPlanSchemasPanel() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [params, setParams] = useQueryStates({
    bps_page: parseAsInteger.withDefault(1),
    bps_size: parseAsInteger.withDefault(10),
    bps_plan: parseAsString,
    bps_search: parseAsString,
  });

  const page = params.bps_page;
  const size = params.bps_size;
  const filterPlanId = params.bps_plan ?? "all";
  const search = params.bps_search ?? "";

  function setPage(p: number) { setParams({ bps_page: p }); }
  function setSize(s: number) { setParams({ bps_size: s, bps_page: 1 }); }
  function setFilterPlanId(v: string) { setParams({ bps_plan: v === "all" ? null : v, bps_page: 1 }); }
  function setSearch(v: string) { setParams({ bps_search: v || null, bps_page: 1 }); }

  const { data: plansData } = useAdminBroadbandPlans({ per_page: 100 });
  const plans = plansData?.broadband_plans ?? [];

  const queryParams = {
    page,
    size,
    ...(filterPlanId !== "all" ? { broadband_plan_id: filterPlanId } : {}),
  };

  const { data: listEnv, isLoading, isError } = useBroadbandPlanSchemas(queryParams);
  const rows = listEnv?.data?.broadband_plan_schemas ?? [];
  const meta = listEnv?.data?.metadata;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const deleteSchema = useDeleteBroadbandPlanSchema();
  const planNameMap = Object.fromEntries(plans.map((p) => [p.id, p.name]));

  const pgGroupStart = Math.floor((page - 1) / 5) * 5;
  const pgGroupEnd = Math.min(pgGroupStart + 5, totalPages);
  const pgButtons = Array.from({ length: pgGroupEnd - pgGroupStart }, (_, i) => pgGroupStart + i + 1);

  const filtered = search
    ? rows.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.schema_name.toLowerCase().includes(q) ||
          r.schema_type.toLowerCase().includes(q) ||
          (planNameMap[r.broadband_plan_id] ?? "").toLowerCase().includes(q)
        );
      })
    : rows;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("administration.schema.bpsDesc")}
      </p>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full sm:w-60">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("administration.schema.bpsSearch")}
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterPlanId} onValueChange={setFilterPlanId}>
          <SelectTrigger className="h-9 w-full sm:w-56">
            <SelectValue placeholder={t("administration.schema.bpsAllPlans")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("administration.schema.bpsAllPlans")}</SelectItem>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button
          variant="primary"
          size="sm"
          className="h-9 px-4 font-medium w-full sm:w-auto"
          onClick={() => setFormOpen(true)}
        >
          <RiAddLine className="size-4 mr-1.5" />
          {t("administration.schema.bpsAssignSchema")}
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <RiLoader4Line className="size-4 animate-spin" />
          {t("administration.schema.bpsLoading")}
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-destructive">{t("administration.schema.bpsError")}</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <RiWifiLine className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("administration.schema.bpsEmpty")}</p>
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <RiAddLine className="size-4 mr-1" /> {t("administration.schema.bpsAssignFirst")}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <RiWifiLine className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold truncate">
                    {planNameMap[row.broadband_plan_id] ?? row.broadband_plan_id}
                  </span>
                  <Badge className={`text-[11px] font-semibold px-2 py-0 border uppercase ${schemaTypeColor(row.schema_type)}`}>
                    {row.schema_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{row.schema_name}</p>
              </div>
              <Button
                variant="ghost"
                mode="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => setDeleteTarget({ id: row.id, name: row.schema_name })}
              >
                <RiDeleteBinLine className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("administration.schema.bpsRowsPerPage")}</span>
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
              {(page - 1) * size + 1} - {Math.min(page * size, total)} {t("administration.schema.bpsOf")} {total}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  size="sm" mode="icon" variant="ghost" className="size-7 p-0"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
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

                <Button
                  size="sm" mode="icon" variant="ghost" className="size-7 p-0"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.schema.bpsRemoveTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("administration.schema.bpsRemoveDesc")} <span className="font-semibold text-foreground">{deleteTarget?.name}</span> {t("administration.schema.bpsRemoveDesc2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSchema.isPending}>{t("administration.schema.bpsRemoveCancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteSchema.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  deleteSchema.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
                }
              }}
            >
              {deleteSchema.isPending ? t("administration.schema.bpsRemoving") : t("administration.schema.bpsRemove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BroadbandPlanSchemaFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultPlanId={filterPlanId !== "all" ? filterPlanId : undefined}
      />
    </div>
  );
}
