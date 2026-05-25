"use client";

import { format } from "date-fns";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useTechnicianHistory } from "../../../api/analytics";
import { ModalShell } from "./shell";
import { STATE_VARIANT, STATE_LABEL, TYPE_LABEL, STATE_I18N_KEY, TYPE_I18N_KEY } from "../shared";
import type { WorkOrderHistoryItem } from "../../../types/technician-api";

function fmtDate(s: string | undefined | null) {
  if (!s) return "—";
  try { return format(new Date(s), "d MMM yyyy"); } catch { return s; }
}

const STATE_BORDER: Record<string, string> = {
  completed:   "border-l-emerald-500",
  cancelled:   "border-l-rose-500",
  rescheduled: "border-l-amber-500",
  in_progress: "border-l-blue-500",
};

function HistoryRow({ item }: { item: WorkOrderHistoryItem }) {
  const { t } = useTranslation();
  const borderColor = STATE_BORDER[item.state] ?? "border-l-slate-300";
  return (
    <li className={`border-l-4 ${borderColor} pl-4 pr-3 py-3 bg-white dark:bg-slate-900 rounded-r-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={paths.dashboard.technician.detail.getHref((item as any).id ?? item.work_order_id)}
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              {item.number}
              <ExternalLink className="size-3 opacity-60" />
            </Link>
            <Badge
              variant={STATE_VARIANT[item.state] ?? "primary"}
              appearance="light"
              size="sm"
              className="uppercase text-[10px] font-semibold"
            >
              {t(STATE_I18N_KEY[item.state]) || STATE_LABEL[item.state] || item.state}
            </Badge>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {t(TYPE_I18N_KEY[item.type]) || TYPE_LABEL[item.type] || item.type}
          </p>
          {item.summary && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          )}
          {item.technician_names?.length > 1 && (
            <p className="text-[10px] text-slate-400 mt-1">
              {t("workOrder.noc.team") || "Team"}: {item.technician_names.join(", ")}
            </p>
          )}
        </div>
        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
          {fmtDate(item.completed_at)}
        </span>
      </div>
    </li>
  );
}

export function TechnicianHistoryModal({
  technicianId,
  technicianName,
  onClose,
}: {
  technicianId: string;
  technicianName: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useTechnicianHistory({ technicianId, params: {} });

  return (
    <ModalShell
      title={t("workOrder.detail.modals.history.title")}
      subtitle={technicianName}
      onClose={onClose}
      widthClass="max-w-xl"
      footer={<Button variant="outline" size="sm" onClick={onClose}>{t("common.close")}</Button>}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="size-8 text-rose-400" />
          <p className="text-sm text-slate-500">{t("workOrder.detail.modals.history.failedToLoad")}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>{t("workOrder.noc.retry") || "Retry"}</Button>
        </div>
      )}

      {data && (
        <div className="space-y-5">
          {/* Summary strip */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-extrabold text-on-surface leading-none">
                {data.summary.total_jobs}
              </span>
              <span className="text-sm text-slate-500 mb-1">{t("workOrder.detail.modals.history.totalJobs")}</span>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{data.summary.completed}</span>
                <span className="text-slate-400">{t("workOrder.detail.modals.history.completed")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{data.summary.cancelled}</span>
                <span className="text-slate-400">{t("workOrder.detail.modals.history.cancelled")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{data.summary.rescheduled}</span>
                <span className="text-slate-400">{t("workOrder.detail.modals.history.rescheduled")}</span>
              </span>
            </div>
          </div>

          {/* WO list */}
          {!data.items?.length ? (
            <p className="text-sm text-slate-400 italic text-center py-8">{t("workOrder.detail.modals.history.noHistory")}</p>
          ) : (
            <ol className="space-y-2">
              {data.items.map((item: WorkOrderHistoryItem, index: number) => (
                <HistoryRow key={`${item.id || item.work_order_id || "history"}-${index}`} item={item} />
              ))}
            </ol>
          )}
        </div>
      )}
    </ModalShell>
  );
}
