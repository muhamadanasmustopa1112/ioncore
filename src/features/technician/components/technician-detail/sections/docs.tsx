"use client";

import { useMemo, useState } from "react";
import { Loader2, FileText, CheckCircle2, ClipboardCheck, AlertTriangle, PenTool, Package, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWorkOrder, useCustomerHistory, useSiteHistory } from "../../../api/technician-queries";
import type { WorkOrderDetailResponse } from "../../../types/technician-api";
import { WOHistoryModal } from "../modals/wo-history";
import {
  SectionCard,
  Field,
  Empty,
  fmtDate,
  humanize,
  RESOLUTION_VARIANT,
  SIGNOFF_VARIANT,
  NOC_DECISION_VARIANT,
  BILLING_VARIANT,
} from "../shared";
import { HistoryList } from "../shared-widgets";

export function DocsSections({ wo }: { wo: WorkOrderDetailResponse }) {
  const [notes, setNotes] = useState(wo.description ?? "");
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);
  const [showSiteHistory, setShowSiteHistory] = useState(false);
  const updateMutation = useUpdateWorkOrder(wo.id);

  const customerHistory = useCustomerHistory(showCustomerHistory ? wo.customer_id : "");
  const siteHistory = useSiteHistory(showSiteHistory ? wo.site_id : "");

  const proofItems = useMemo(() => wo.proof_of_work ?? [], [wo.proof_of_work]);

  return (
    <>
      {/* Description / Notes */}
      <SectionCard icon={FileText} title="Description / Notes">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add installation notes, site difficulties, equipment IDs..."
          className="min-h-[120px] bg-slate-50 dark:bg-slate-800 border-none resize-none"
        />
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => updateMutation.mutate({ description: notes })}
            disabled={updateMutation.isPending || notes === (wo.description ?? "")}
            className="font-bold uppercase tracking-widest text-[10px]"
          >
            {updateMutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            Save Notes
          </Button>
        </div>
      </SectionCard>

      {/* Proof of Work — READ-ONLY (execution handled by mobile app) */}
      <SectionCard icon={CheckCircle2} title="Proof of Work">
        {proofItems.length > 0 ? (
          <div className="space-y-2">
            {proofItems.map((item) => (
              <div
                key={item.item_id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${item.completed
                    ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                    : "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                  }`}
              >
                <div className={`size-5 rounded flex items-center justify-center shrink-0 ${item.completed ? "bg-emerald-500" : "border-2 border-slate-300 dark:border-slate-600"}`}>
                  {item.completed && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${item.completed ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"}`}>
                    {item.item_label}
                    {item.required && <span className="text-rose-500 ml-1">*</span>}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 mt-0.5">
                    {item.category && <span className="capitalize">{humanize(item.category)}</span>}
                    {item.field_type && <span>· {humanize(item.field_type)}</span>}
                    {item.completed_at && <span>· {fmtDate(item.completed_at)}</span>}
                    {item.evidence && item.evidence.length > 0 && <span>· {item.evidence.length} evidence</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty>No proof-of-work items yet.</Empty>
        )}
      </SectionCard>

      {/* Resolution Log */}
      {wo.resolution_log && wo.resolution_log.length > 0 && (
        <SectionCard icon={ClipboardCheck} title="Resolution Log">
          <div className="space-y-3">
            {wo.resolution_log.map((r) => (
              <div key={r.item_id} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{r.item_label}</p>
                  <Badge variant={RESOLUTION_VARIANT[r.resolution_status] ?? "info"} appearance="light" size="sm" className="uppercase shrink-0">
                    {humanize(r.resolution_status)}
                  </Badge>
                </div>
                {r.category && <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">{humanize(r.category)}</p>}
                {r.finding && <p className="text-xs text-slate-600 dark:text-slate-400 mb-1"><span className="font-semibold text-slate-500">Finding:</span> {r.finding}</p>}
                {r.action_taken && <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-500">Action:</span> {r.action_taken}</p>}
                <div className="flex flex-wrap gap-x-3 text-[10px] text-slate-400 mt-2">
                  {r.time_spent_minutes != null && <span>{r.time_spent_minutes} min</span>}
                  {r.timestamp && <span>· {fmtDate(r.timestamp)}</span>}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Issue Report */}
      {wo.issue_report && (
        <SectionCard icon={AlertTriangle} title="Issue Report" headerClass="border-l-4 border-rose-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Reason Code" value={humanize(wo.issue_report.reason_code)} />
            <Field label="Reported At" value={fmtDate(wo.issue_report.reported_at)} />
            <Field label="Reported By" value={`${wo.issue_report.reported_by ?? "—"} (${wo.issue_report.reported_role ?? "—"})`} />
            <Field label="Reschedule Requested" value={wo.issue_report.request_reschedule ? "Yes" : "No"} />
            {wo.issue_report.note && <Field label="Note" value={wo.issue_report.note} className="sm:col-span-2" />}
          </div>
        </SectionCard>
      )}

      {/* Customer Sign-Off */}
      {wo.customer_sign_off && (
        <SectionCard icon={PenTool} title="Customer Sign-Off">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Status</p>
              <Badge variant={SIGNOFF_VARIANT[wo.customer_sign_off.status] ?? "info"} appearance="light" size="sm" className="uppercase mt-1">
                {humanize(wo.customer_sign_off.status)}
              </Badge>
            </div>
            <Field label="Mode" value={humanize(wo.customer_sign_off.mode)} />
            <Field label="Signed By" value={wo.customer_sign_off.signed_by} />
            <Field label="Requested At" value={fmtDate(wo.customer_sign_off.requested_at)} />
            <Field label="Confirmed At" value={fmtDate(wo.customer_sign_off.confirmed_at)} />
          </div>
          {wo.customer_sign_off.signature_url && (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Signature</p>
              <img src={wo.customer_sign_off.signature_url} alt="Signature" className="max-h-32 border border-slate-200 dark:border-slate-700 rounded bg-white" />
            </div>
          )}
          {wo.customer_sign_off.remote_otp && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg text-xs">
              <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Remote OTP</p>
              <p className="text-slate-600 dark:text-slate-400">
                Status: <span className="font-semibold">{humanize(wo.customer_sign_off.remote_otp.status)}</span>
                {wo.customer_sign_off.remote_otp.delivery_channel && ` · ${wo.customer_sign_off.remote_otp.delivery_channel}`}
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* BAST Submission */}
      {wo.bast && (
        <SectionCard icon={ClipboardCheck} title="BAST Submission" headerClass="border-l-4 border-emerald-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <Field label="Submitted At" value={fmtDate(wo.bast.submitted_at)} />
            <Field label="Submitted By" value={`${wo.bast.submitted_by ?? "—"} (${wo.bast.submitted_role ?? "—"})`} />
            {wo.bast.summary && <Field label="Summary" value={wo.bast.summary} className="sm:col-span-2" />}
          </div>
          {wo.bast.flags && wo.bast.flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {wo.bast.flags.map((f) => (
                <Badge key={f} variant="warning" appearance="light" size="sm" className="uppercase">{humanize(f)}</Badge>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* NOC Approval */}
      {wo.noc_approval && (
        <SectionCard icon={ClipboardCheck} title="NOC Approval">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Decision</p>
              <Badge variant={NOC_DECISION_VARIANT[wo.noc_approval.decision] ?? "info"} appearance="light" size="sm" className="uppercase mt-1">
                {humanize(wo.noc_approval.decision)}
              </Badge>
            </div>
            <Field label="Reviewed At" value={fmtDate(wo.noc_approval.reviewed_at)} />
            <Field label="Reviewed By" value={`${wo.noc_approval.reviewed_by ?? "—"} (${wo.noc_approval.reviewed_role ?? "—"})`} />
            <Field label="Re-dispatch Required" value={wo.noc_approval.requires_redispatch ? "Yes" : "No"} />
            {wo.noc_approval.note && <Field label="Note" value={wo.noc_approval.note} className="sm:col-span-2" />}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 mb-1">Billing Trigger</p>
              <Badge variant={BILLING_VARIANT[wo.noc_approval.billing_trigger] ?? "info"} appearance="light" size="sm" className="uppercase">
                {humanize(wo.noc_approval.billing_trigger)}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 mb-1">Radius Trigger</p>
              <Badge variant={BILLING_VARIANT[wo.noc_approval.radius_trigger] ?? "info"} appearance="light" size="sm" className="uppercase">
                {humanize(wo.noc_approval.radius_trigger)}
              </Badge>
            </div>
          </div>
        </SectionCard>
      )}

      {/* NOC Approval Log */}
      {wo.noc_approval_log && wo.noc_approval_log.length > 0 && (
        <SectionCard icon={History} title="NOC Approval Log">
          <ol className="space-y-3">
            {wo.noc_approval_log.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="min-w-0">
                  <Badge variant={NOC_DECISION_VARIANT[entry.decision] ?? "info"} appearance="light" size="sm" className="uppercase mb-1">
                    {humanize(entry.decision)}
                  </Badge>
                  {entry.note && <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{entry.note}</p>}
                  <p className="text-[10px] text-slate-400">{entry.actor_role} · {fmtDate(entry.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Device Disposition */}
      {wo.device_disposition && (
        <SectionCard icon={Package} title="Device Disposition">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Type" value={humanize(wo.device_disposition.type)} />
            <Field label="Device Serial" value={wo.device_disposition.device_serial} />
            <Field label="Decided By" value={wo.device_disposition.decided_by} />
            <Field label="Decided At" value={fmtDate(wo.device_disposition.decided_at)} />
          </div>
        </SectionCard>
      )}

      {/* Previous Customer Jobs */}
      {wo.customer_id && (
        <SectionCard
          icon={History}
          title="Customer WO History"
          rightSlot={
            <Button variant="outline" size="sm" onClick={() => setShowCustomerHistory(true)} className="text-[10px] h-6 px-2">
              View Full History
            </Button>
          }
        >
          {wo.previous_customer_jobs && wo.previous_customer_jobs.length > 0
            ? <HistoryList items={wo.previous_customer_jobs} />
            : <Empty><>No previous jobs for this customer.</></Empty>}
        </SectionCard>
      )}

      {/* Previous Site Jobs */}
      {wo.site_id && (
        <SectionCard
          icon={History}
          title="Site WO History"
          rightSlot={
            <Button variant="outline" size="sm" onClick={() => setShowSiteHistory(true)} className="text-[10px] h-6 px-2">
              View Full History
            </Button>
          }
        >
          {wo.previous_site_jobs && wo.previous_site_jobs.length > 0
            ? <HistoryList items={wo.previous_site_jobs} />
            : <Empty><>No previous jobs for this site.</></Empty>}
        </SectionCard>
      )}

      {/* Customer History Modal */}
      {showCustomerHistory && (
        <WOHistoryModal
          title="Customer WO History"
          subtitle={wo.customer_name}
          items={customerHistory.data?.items ?? []}
          total={customerHistory.data?.total}
          isLoading={customerHistory.isLoading}
          isError={customerHistory.isError}
          onRetry={() => customerHistory.refetch()}
          onClose={() => setShowCustomerHistory(false)}
        />
      )}

      {/* Site History Modal */}
      {showSiteHistory && (
        <WOHistoryModal
          title="Site WO History"
          subtitle={wo.site_name}
          items={siteHistory.data?.items ?? []}
          total={siteHistory.data?.total}
          isLoading={siteHistory.isLoading}
          isError={siteHistory.isError}
          onRetry={() => siteHistory.refetch()}
          onClose={() => setShowSiteHistory(false)}
        />
      )}
    </>
  );
}
