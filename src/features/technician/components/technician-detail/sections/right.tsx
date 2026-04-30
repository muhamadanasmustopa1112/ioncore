"use client";

import { useMemo, useState } from "react";
import { Camera, Clock, History, Maximize2, Building, Image as ImageIcon } from "lucide-react";
import type { WorkOrderDetailResponse } from "../../../types/technician-api";
import { SectionCard, Row, Empty, fmtDate } from "../shared";
import { TimelineEntry } from "../shared-widgets";

export function RightSections({ wo }: { wo: WorkOrderDetailResponse }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const images = useMemo(
    () =>
      (wo.proof_of_work ?? [])
        .flatMap((p) => p?.evidence ?? [])
        .map((e) => e?.url)
        .filter((u): u is string => typeof u === "string" && u.length > 0),
    [wo.proof_of_work]
  );

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
          <Row label="Branch" value={wo.branch_name || wo.branch_id} />
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

      {/* Audit */}
      <SectionCard icon={Clock} title="Audit">
        <div className="space-y-2 text-sm">
          <Row label="Created" value={fmtDate(wo.created_at)} />
          <Row label="Updated" value={fmtDate(wo.updated_at)} />
          <Row label="ID" value={<span className="font-mono text-[10px]">{wo.id}</span>} />
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
