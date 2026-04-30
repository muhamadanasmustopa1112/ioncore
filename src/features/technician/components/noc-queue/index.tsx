"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, AlertCircle, ShieldCheck, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useNOCQueue } from "../../api/technician-queries";
import { NOCApprovalModal } from "../technician-detail/modals";
import type {
  NOCQueueItem,
  WorkOrderType,
  WorkOrderPriority,
} from "../../types/technician-api";

const TYPE_LABEL: Record<WorkOrderType, string> = {
  new_installation_broadband: "New Install (Broadband)",
  new_installation_enterprise: "New Install (Enterprise)",
  maintenance: "Maintenance",
  termination: "Termination",
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
  const engineers = item.assigned_team
    .map((t) => t.technician_name)
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
          <span>{TYPE_LABEL[item.type] ?? item.type}</span>
          <span>·</span>
          <span>Team: {engineers}</span>
          <span>·</span>
          <span>Submitted: {fmtDate(item.submitted_at)}</span>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onApprove(item)}
        className="shrink-0 gap-2"
      >
        <ShieldCheck className="size-4" />
        Review
      </Button>
    </div>
  );
}

export function NOCQueueDashboard() {
  const [typeFilter, setTypeFilter] = useState<WorkOrderType | "">("");
  const [activeItem, setActiveItem] = useState<NOCQueueItem | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useNOCQueue({
    type: typeFilter || undefined,
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
        <p className="text-sm text-slate-600">Failed to load NOC queue.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
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
            <ShieldCheck className="size-6 text-primary" /> NOC Queue
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Work orders pending NOC verification</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="shrink-0 gap-2">
          {isFetching ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
          Refresh
        </Button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiTile label="Total" value={summary.total} />
        <KpiTile label="Installations" value={summary.installations} />
        <KpiTile label="Maintenance" value={summary.maintenance} />
        <KpiTile label="Terminations" value={summary.terminations} />
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as WorkOrderType | "")}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3"
        >
          <option value="">All Types</option>
          <option value="new_installation_broadband">New Install (Broadband)</option>
          <option value="new_installation_enterprise">New Install (Enterprise)</option>
          <option value="maintenance">Maintenance</option>
          <option value="termination">Termination</option>
        </select>
        <span className="text-xs text-slate-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Queue list */}
      <Card>
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Pending Review
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 italic p-6 text-center">Queue is clear — no WOs pending NOC verification.</p>
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
