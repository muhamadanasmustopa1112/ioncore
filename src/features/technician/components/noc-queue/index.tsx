"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Loader2, AlertCircle, ShieldCheck, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useNOCQueue } from "../../api/noc";
import { NOCApprovalModal } from "../technician-detail/modals";
import type {
  NOCQueueItem,
  WorkOrderType,
  WorkOrderPriority,
} from "../../types/technician-api";

const TYPE_I18N_KEY: Record<WorkOrderType, string> = {
  new_installation_broadband: "workOrder.types.newInstallBroadband",
  new_installation_enterprise: "workOrder.types.newInstallEnterprise",
  maintenance: "workOrder.types.maintenance",
  termination: "workOrder.types.termination",
};

const PRIORITY_VARIANT: Record<WorkOrderPriority, "primary" | "warning" | "destructive" | "info"> = {
  low: "info",
  medium: "primary",
  high: "warning",
  urgent: "destructive",
};

function fmtDate(s: string | undefined | null) {
  if (!s) return "—";
  try { return format(new Date(s), "PP p"); } catch { return s; }
}

function KpiTile({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-3xl font-bold text-on-surface">{value}</p>
        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function QueueRow({
  item,
  onApprove,
}: {
  item: NOCQueueItem;
  onApprove: (item: NOCQueueItem) => void;
}) {
  const { t } = useTranslation();
  const engineers = item.assigned_team
    .map((tm) => tm.technician_name)
    .filter(Boolean)
    .join(" & ") || "—";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Link
            href={paths.dashboard.technician.detail.getHref(item.work_order_id)}
            className="text-xs font-bold text-primary hover:underline"
          >
            {item.work_order_number}
          </Link>
          <Badge variant={PRIORITY_VARIANT[item.priority] ?? "primary"} appearance="light" size="sm" className="uppercase">
            {item.priority}
          </Badge>
          {item.flags && item.flags.length > 0 && item.flags.map((f) => (
            <Badge key={f} variant="warning" appearance="light" size="sm" className="capitalize">
              {f.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate mb-0.5">{item.title}</p>
        <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-400">
          <span>{t(TYPE_I18N_KEY[item.type]) ?? item.type}</span>
          <span>·</span>
          <span>{t("workOrder.noc.team")}: {engineers}</span>
          <span>·</span>
          <span>{t("workOrder.noc.submitted")}: {fmtDate(item.submitted_at)}</span>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onApprove(item)}
        className="shrink-0 gap-2"
      >
        <ShieldCheck className="size-4" />
        {t("workOrder.noc.review")}
      </Button>
    </div>
  );
}

export function NOCQueueDashboard() {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState<WorkOrderType | "">("");
  const [activeItem, setActiveItem] = useState<NOCQueueItem | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useNOCQueue({
    params: { type: typeFilter || undefined },
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="size-10 text-rose-500" />
        <p className="text-sm text-slate-600">{t("workOrder.noc.failedToLoad")}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>{t("workOrder.noc.retry")}</Button>
      </div>
    );
  }

  const summary = data.summary;
  const items = data.items ?? [];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <ShieldCheck className="size-6 text-primary" /> {t("workOrder.noc.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("workOrder.noc.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="shrink-0 gap-2">
          {isFetching ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
          {t("workOrder.noc.refresh")}
        </Button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiTile label={t("workOrder.noc.total")} value={summary.total} />
        <KpiTile label={t("workOrder.noc.installations")} value={summary.installations} />
        <KpiTile label={t("workOrder.noc.maintenance")} value={summary.maintenance} />
        <KpiTile label={t("workOrder.noc.terminations")} value={summary.terminations} />
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as WorkOrderType | "")}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3"
        >
          <option value="">{t("workOrder.types.allTypes")}</option>
          <option value="new_installation_broadband">{t("workOrder.types.newInstallBroadband")}</option>
          <option value="new_installation_enterprise">{t("workOrder.types.newInstallEnterprise")}</option>
          <option value="maintenance">{t("workOrder.types.maintenance")}</option>
          <option value="termination">{t("workOrder.types.termination")}</option>
        </select>
        <span className="text-xs text-slate-400">
          {items.length} {items.length !== 1 ? t("workOrder.noc.items") : t("workOrder.noc.item")}
        </span>
      </div>

      {/* Queue list */}
      <Card>
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> {t("workOrder.noc.pendingReview")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 italic p-6 text-center">{t("workOrder.noc.queueClear")}</p>
          ) : (
            items.map((item) => (
              <QueueRow key={item.work_order_id} item={item} onApprove={setActiveItem} />
            ))
          )}
        </CardContent>
      </Card>

      {/* NOC Approval Modal */}
      {activeItem && (
        <NOCApprovalModal
          workOrderId={activeItem.work_order_id}
          workOrderNumber={activeItem.work_order_number}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  );
}
