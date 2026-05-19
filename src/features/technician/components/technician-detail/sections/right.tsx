"use client";

import { useMemo, useState } from "react";
import { Camera, Clock, History, Maximize2, Building, Image as ImageIcon, FileText } from "lucide-react";
import type { AuditTrailEntry, WorkOrderDetailResponse } from "../../../types/technician-api";
import { SectionCard, Row, Empty, fmtDate } from "../shared";
import { TimelineEntry } from "../shared-widgets";

type AuditMetadataDisplayKey = keyof Pick<
  NonNullable<AuditTrailEntry["metadata"]>,
  | "added_technician_names"
  | "removed_technician_names"
  | "original_pair_names"
  | "new_pair_names"
  | "reassignment_mode"
>;

const AUDIT_METADATA_FIELDS: { key: AuditMetadataDisplayKey; label: string }[] = [
  { key: "added_technician_names", label: "Added technician" },
  { key: "removed_technician_names", label: "Removed technician" },
  { key: "original_pair_names", label: "Original pair" },
  { key: "new_pair_names", label: "New pair" },
  { key: "reassignment_mode", label: "Reassignment mode" },
];

function formatAuditMetadataValue(val: string): string {
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

export function RightSections({ wo }: { wo: WorkOrderDetailResponse }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const images = useMemo(() => {
    const collected: string[] = [];
    (wo.proof_of_work ?? []).forEach((p) => {
      // 1. Collect from evidence array
      (p.evidence ?? []).forEach((e) => {
        if (e?.url) collected.push(e.url);
      });

      // 2. Collect from value if it's a photo and looks like a URL
      if (
        (p.field_type === "photo" || p.category === "photo") &&
        p.value &&
        (p.value.startsWith("http") || p.value.startsWith("/"))
      ) {
        collected.push(p.value);
      }
    });

    // Also collect from other sections if needed (e.g. customer_sign_off, issue_report)
    if (wo.customer_sign_off?.signature_url) {
      collected.push(wo.customer_sign_off.signature_url);
    }
    (wo.issue_report?.evidence ?? []).forEach((e) => {
      if (e?.url) collected.push(e.url);
    });

    return Array.from(new Set(collected)).filter(Boolean);
  }, [wo]);

  return (
    <>
      {/* Assignment SLA */}
      {wo.assignment_sla && (
        <SectionCard
          icon={Clock}
          title="Assignment SLA"
          tone={wo.assignment_sla.breached_at ? "rose" : "default"}
        >
          <div className="space-y-2 text-sm">
            <Row label="Due At" value={fmtDate(wo.assignment_sla.due_at)} />
            <Row label="Window" value={`${wo.assignment_sla.window_minutes} min`} />
            <Row label="Auto-assign" value={wo.assignment_sla.auto_assign_enabled ? "Enabled" : "Disabled"} />
            {wo.assignment_sla.warning_triggered_at && (
              <Row label="Warning" value={fmtDate(wo.assignment_sla.warning_triggered_at)} valueClass="text-amber-600" />
            )}
            {wo.assignment_sla.breached_at && (
              <Row label="Breached" value={fmtDate(wo.assignment_sla.breached_at)} valueClass="text-rose-600 font-bold" />
            )}
          </div>
        </SectionCard>
      )}

      {/* Reschedule Info */}
      {wo.reschedule && (
        <SectionCard icon={Clock} title="Reschedule" tone="amber">
          <div className="space-y-2 text-sm">
            <Row label="New Date" value={fmtDate(wo.reschedule.rescheduled_to)} />
            <Row label="Requested By" value={wo.reschedule.requested_by} />
            <Row label="Requested At" value={fmtDate(wo.reschedule.requested_at)} />
            {wo.reschedule.reason && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 mt-2">Reason</p>
                <p className="text-xs text-slate-600">{wo.reschedule.reason}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Photo Evidence */}
      <SectionCard icon={ImageIcon} title="Photo Evidence">
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer group relative"
                onClick={() => setPreviewImage(src)}
              >
                <img
                  src={src}
                  alt={`Evidence ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize2 className="size-5 text-white" />
                </div>
              </div>
            ))}
            <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
              <Camera className="size-6 text-slate-400" />
              <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Upload</span>
            </div>
          </div>
        ) : (
          <Empty>No photos uploaded yet.</Empty>
        )}
      </SectionCard>

      {/* Branch & Area */}
      <SectionCard icon={Building} title="Branch & Area">
        <div className="space-y-2 text-sm">
          <Row label="Branch" value={wo.branch.name} />
          <Row label="Area" value={wo.area_name || wo.area_id} />
          <Row label="Sub Area" value={wo.sub_area_name || wo.sub_area_id} />
        </div>
      </SectionCard>

      {/* Timeline */}
      {wo.timeline && wo.timeline.length > 0 && (
        <SectionCard icon={History} title="Timeline">
          <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-4">
            {[...wo.timeline]
              .sort((a, b) => {
                const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
                const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
                return tb - ta;
              })
              .map((t) => (
                <TimelineEntry key={t?.id ?? `${t?.created_at}-${t?.action}`} t={t} />
              ))}
          </ol>
        </SectionCard>
      )}

      {/* Audit Trail */}
      <SectionCard icon={FileText} title="Audit Trail">
        {/* Basic metadata */}
        <div className="space-y-2 text-sm mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Row label="Created" value={fmtDate(wo.created_at)} />
          <Row label="Updated" value={fmtDate(wo.updated_at)} />
        </div>

        {/* Activity stream */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Activity Logs</p>
          {wo.audit_trail && wo.audit_trail.length > 0 ? (
            <div className="space-y-3">
              {wo.audit_trail.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                      {item.action.replace(/_/g, " ")}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold font-mono shrink-0">
                      {item.actor_role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">
                    By {item.actor_role} · {fmtDate(item.created_at)}
                  </p>

                  {item.metadata &&
                    AUDIT_METADATA_FIELDS.some(({ key }) => {
                      const val = item.metadata?.[key];
                      return typeof val === "string" && val.trim().length > 0;
                    }) && (
                    <div className="text-[10px] bg-white dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800 space-y-2 font-medium text-slate-600">
                      {AUDIT_METADATA_FIELDS.map(({ key, label }) => {
                        const raw = item.metadata?.[key];
                        if (typeof raw !== "string" || !raw.trim()) return null;
                        const display =
                          key === "reassignment_mode"
                            ? raw.replace(/_/g, " ")
                            : formatAuditMetadataValue(raw);
                        return (
                          <div key={key} className="flex flex-col">
                            <span className="text-slate-400 uppercase text-[8px] font-bold tracking-wider">{label}</span>
                            <span className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 px-1 py-0.5 rounded mt-0.5 border border-slate-100/50 dark:border-slate-800 capitalize">
                              {display}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty>No audit trail records found.</Empty>
          )}
        </div>
      </SectionCard>

      {/* Image Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute -top-12 right-0 text-white hover:text-primary text-sm font-semibold transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              Close [Esc]
            </button>
          </div>
        </div>
      )}
    </>
  );
}
