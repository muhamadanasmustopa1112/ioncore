"use client";

import { format } from "date-fns";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ModalShell } from "./shell";
import { STATE_VARIANT, STATE_LABEL, TYPE_LABEL } from "../shared";
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
  const borderColor = STATE_BORDER[item.state] ?? "border-l-slate-300";
  return (
    <li className={`border-l-4 ${borderColor} pl-4 pr-3 py-3 bg-white dark:bg-slate-900 rounded-r-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={paths.dashboard.technician.detail.getHref(item.work_order_id)}
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              {item.number}
              <ExternalLink className="size-3 opacity-60" />
            </Link>
            <Badge variant={STATE_VARIANT[item.state] ?? "primary"} appearance="light" size="sm" className="uppercase text-[10px]">
              {STATE_LABEL[item.state] ?? item.state}
            </Badge>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {TYPE_LABEL[item.type] ?? item.type}
          </p>
          {item.summary && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{item.summary}</p>
          )}
          {item.technician_names?.length > 0 && (
            <p className="text-[10px] text-slate-400 mt-1">Team: {item.technician_names.join(", ")}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">{fmtDate(item.completed_at)}</span>
      </div>
    </li>
  );
}

export function WOHistoryModal({
  title,
  subtitle,
  items,
  total,
  isLoading,
  isError,
  onRetry,
  onClose,
}: {
  title: string;
  subtitle?: string;
  items: WorkOrderHistoryItem[];
  total?: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      widthClass="max-w-xl"
      footer={<Button variant="outline" size="sm" onClick={onClose}>Close</Button>}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="size-8 text-rose-400" />
          <p className="text-sm text-slate-500">Failed to load history.</p>
          <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {typeof total === "number" && (
            <p className="text-xs text-slate-400 mb-3">{total} work order{total !== 1 ? "s" : ""} found</p>
          )}
          {items.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-8">No work order history found.</p>
          ) : (
            <ol className="space-y-2">
              {items.map((item) => <HistoryRow key={item.work_order_id} item={item} />)}
            </ol>
          )}
        </>
      )}
    </ModalShell>
  );
}
