"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Clock, Check, History } from "lucide-react";
import { paths } from "@/config/paths";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { AssignedTechnician, WorkOrderState, WorkOrderType } from "../../types/technician-api";
import { STATE_LABEL, STATE_I18N_KEY, TYPE_I18N_KEY } from "./shared";
import { TechnicianHistoryModal } from "./modals/technician-history";
import { format } from "date-fns";

function fmtDate(s: string | undefined | null) {
  if (!s) return "—";
  try { return format(new Date(s), "PP p"); } catch { return s; }
}

function humanize(s: string | undefined | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ");
}

// ── TechnicianCard ─────────────────────────────────────────────────────────

export function TechnicianCard({ t }: { t: AssignedTechnician }) {
  const { t: translate } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const isLead = t?.role === "lead" || t?.level === "senior";

  const isIndo = translate("workOrder.detail.no").toLowerCase() === "tidak";
  const acceptedLabel = t?.accepted 
    ? `✓ ${translate("workOrder.states.accepted")}`
    : translate("workOrder.detail.awaitingAcceptance");

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
        <div className={`size-10 sm:size-12 rounded-full flex items-center justify-center shrink-0 ${isLead ? "bg-primary/10" : "bg-slate-200 dark:bg-slate-700"}`}>
          <User className={`size-5 sm:size-6 ${isLead ? "text-primary" : "text-slate-500"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[10px] font-bold uppercase tracking-tight ${isLead ? "text-primary" : "text-slate-400"}`}>
            {t?.level ?? "—"} · {t?.role ?? "—"}
          </p>
          <p className="text-sm font-bold truncate">{t?.technician_name || "—"}</p>
          <p className="text-[10px] text-slate-500">
            {acceptedLabel}
            {t?.cross_area ? ` · ${translate("workOrder.detail.crossArea")}` : ""}
            {typeof t?.active_workload === "number" ? ` · ${t.active_workload} ${isIndo ? "aktif" : "active"}` : ""}
          </p>
        </div>
        {t?.technician_id && (
          <button
            onClick={() => setShowHistory(true)}
            className="shrink-0 text-slate-400 hover:text-primary transition-colors"
            title={translate("workOrder.detail.customerWoHistory")}
          >
            <History className="size-4" />
          </button>
        )}
      </div>
      {showHistory && t?.technician_id && (
        <TechnicianHistoryModal
          technicianId={t.technician_id}
          technicianName={t.technician_name || t.technician_id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}

// ── JourneyRow ─────────────────────────────────────────────────────────────

export function JourneyRow({ label, done, detail }: { label: string; done: boolean; detail: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${done ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"}`}>
      <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
        {done ? <Check className="size-4 text-white" /> : <Clock className="size-3.5 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${done ? "text-slate-700 dark:text-slate-300" : "text-slate-500"}`}>{label}</p>
        <p className="text-[10px] text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

// ── HistoryList ────────────────────────────────────────────────────────────

export function HistoryList({
  items,
}: {
  items: {
    work_order_id: string;
    number: string;
    type: WorkOrderType;
    state: WorkOrderState;
    completed_at: string;
    technician_names: string[];
    summary: string;
  }[];
}) {
  const { t: translate } = useTranslation();
  return (
    <ol className="space-y-2">
      {items.map((h, i) => (
        <li key={`${h.work_order_id}-${i}`} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
          <Link
            href={paths.dashboard.technician.detail.getHref(h.work_order_id)}
            className="text-xs font-bold text-primary hover:underline shrink-0"
          >
            {h.number}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">{h.summary}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {translate(TYPE_I18N_KEY[h.type]) ?? humanize(h.type)} · {translate(STATE_I18N_KEY[h.state]) ?? humanize(h.state)} · {fmtDate(h.completed_at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── TimelineEntry ──────────────────────────────────────────────────────────

const ACTION_TONE: Record<string, { dot: string; ring: string }> = {
  created: { dot: "bg-slate-400", ring: "ring-slate-200" },
  assigned: { dot: "bg-blue-500", ring: "ring-blue-200" },
  accepted: { dot: "bg-indigo-500", ring: "ring-indigo-200" },
  dispatched: { dot: "bg-violet-500", ring: "ring-violet-200" },
  started: { dot: "bg-blue-500", ring: "ring-blue-200" },
  arrived: { dot: "bg-cyan-500", ring: "ring-cyan-200" },
  in_progress: { dot: "bg-blue-500", ring: "ring-blue-200" },
  completed: { dot: "bg-emerald-500", ring: "ring-emerald-200" },
  cancelled: { dot: "bg-rose-500", ring: "ring-rose-200" },
  rescheduled: { dot: "bg-amber-500", ring: "ring-amber-200" },
  noc_approved: { dot: "bg-emerald-500", ring: "ring-emerald-200" },
  noc_rejected: { dot: "bg-rose-500", ring: "ring-rose-200" },
  bast_submitted: { dot: "bg-purple-500", ring: "ring-purple-200" },
};

function pickActionTone(action: string | null | undefined, toState: WorkOrderState | null | undefined) {
  const key = (action ?? "").toLowerCase();
  if (ACTION_TONE[key]) return ACTION_TONE[key];
  if (toState && ACTION_TONE[toState]) return ACTION_TONE[toState];
  return { dot: "bg-primary", ring: "ring-primary/20" };
}

export function TimelineEntry({
  t,
}: {
  t: {
    id?: string;
    action?: string;
    actor_id?: string;
    actor_role?: string;
    actor_name?: string;
    cable_excess_meter?: number
    cable_excess_price?: number
    from_state?: WorkOrderState | null;
    to_state?: WorkOrderState | null;
    note?: string;
    created_at?: string;
  };
}) {
  const { t: translate } = useTranslation();
  const tone = pickActionTone(t?.action, t?.to_state);
  const fromLabel = t?.from_state ? translate(STATE_I18N_KEY[t.from_state]) ?? humanize(t.from_state) : null;
  const toLabel = t?.to_state ? translate(STATE_I18N_KEY[t.to_state]) ?? humanize(t.to_state) : null;
  const showTransition = fromLabel && toLabel && fromLabel !== toLabel;

  const isIndo = translate("workOrder.detail.no").toLowerCase() === "tidak";

  return (
    <li className="ml-4 relative">
      <span className={`absolute -left-[1.45rem] top-1.5 size-3 rounded-full ${tone.dot} ring-4 ${tone.ring} dark:ring-slate-900`} />
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
          {humanize(t?.action) || "event"}
        </span>
        {showTransition && (
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <Badge variant="info" appearance="light" size="sm" className="uppercase">{fromLabel}</Badge>
            <span className="text-slate-400">→</span>
            <Badge variant="primary" appearance="light" size="sm" className="uppercase">{toLabel}</Badge>
          </span>
        )}
        {!showTransition && toLabel && (
          <Badge variant="primary" appearance="light" size="sm" className="uppercase">{toLabel}</Badge>
        )}
      </div>
      <p className="text-[10px] text-slate-400 mb-1">{fmtDate(t?.created_at)}</p>
      {t?.note && <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.note}</p>}
      {(t?.cable_excess_meter ?? 0) > 0 && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {translate("leads.excessCable")}: <span className="font-semibold text-slate-900 dark:text-slate-100">{t.cable_excess_meter}m</span>
          {(t?.cable_excess_price ?? 0) > 0 && (
            <span className="ml-1 text-slate-500 font-medium">
              (Rp {t.cable_excess_price?.toLocaleString("id-ID")})
            </span>
          )}
        </p>
      )}
      {t?.actor_role && (
        <p className="text-[10px] text-slate-400 italic mt-1">
          {isIndo ? "oleh" : "by"} <span className="capitalize font-medium">{humanize(t.actor_role)}</span>
          {t.actor_name ? ` · ${t.actor_name}` : ""}
        </p>
      )}
    </li>
  );
}
