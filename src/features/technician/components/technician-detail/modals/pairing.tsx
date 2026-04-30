"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, AlertTriangle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignPairing,
  useUpdatePairing,
  usePairingRecommendation,
} from "../../../api/technician-queries";
import type {
  AssignedTechnician,
  DispatchCandidate,
  PairingRecommendationResponse,
} from "../../../types/technician-api";
import { ModalShell, FieldLabel } from "./shell";

const LEVEL_COLOR: Record<string, { bg: string; text: string; ring: string }> = {
  senior: { bg: "bg-primary/10",                        text: "text-primary",                           ring: "ring-primary/30" },
  junior: { bg: "bg-blue-100 dark:bg-blue-900/20",      text: "text-blue-600 dark:text-blue-400",       ring: "ring-blue-300/30" },
  lead:   { bg: "bg-amber-100 dark:bg-amber-900/20",    text: "text-amber-600 dark:text-amber-400",     ring: "ring-amber-300/30" },
};

function ScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(score)));
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";
  const label = pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[10px] font-bold ${label}`}>{pct}%</span>
    </div>
  );
}

function CandidateCard({
  candidate,
  selected,
  onToggle,
}: {
  candidate: DispatchCandidate;
  selected: boolean;
  onToggle: () => void;
}) {
  const lc = LEVEL_COLOR[candidate.level] ?? LEVEL_COLOR.junior;
  const initials = candidate.technician_name
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
        selected
          ? "border-primary bg-primary/5 dark:bg-primary/10"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`size-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ring-2 ${lc.bg} ${lc.text} ${lc.ring}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold truncate">{candidate.technician_name}</span>
            <Badge variant={candidate.level === "senior" ? "primary" : "info"} appearance="light" size="sm" className="uppercase shrink-0">
              {candidate.level}
            </Badge>
            {candidate.cross_area && (
              <Badge variant="warning" appearance="light" size="sm" className="shrink-0">Cross-area</Badge>
            )}
          </div>
          <ScoreBar score={candidate.match_score} />
          <div className="flex flex-wrap items-center gap-x-3 mt-1.5 text-[10px] text-slate-500">
            <span className="font-medium">{candidate.active_workload} active WO{candidate.active_workload !== 1 ? "s" : ""}</span>
            {candidate.skills?.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">{s}</span>
            ))}
          </div>
          {candidate.reasons?.length > 0 && (
            <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">{candidate.reasons.join(" · ")}</p>
          )}
        </div>
        <div className={`size-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600"
        }`}>
          {selected && <span className="text-white text-[10px] font-bold">✓</span>}
        </div>
      </div>
    </button>
  );
}

export function PairingModal({
  workOrderId,
  workOrderNumber,
  currentTeam,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  currentTeam: AssignedTechnician[];
  onClose: () => void;
}) {
  const isReassign = currentTeam.length > 0;
  const [useAuto, setUseAuto] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentTeam.map((t) => t.technician_id));
  const [override, setOverride] = useState(isReassign);
  const [note, setNote] = useState("");
  const [recommendation, setRecommendation] = useState<PairingRecommendationResponse | null>(null);

  const assignMutation = useAssignPairing(workOrderId);
  const updateMutation = useUpdatePairing(workOrderId);
  const recommendMutation = usePairingRecommendation(workOrderId);
  const mutation = isReassign ? updateMutation : assignMutation;

  function handleRecommend() {
    recommendMutation.mutate(
      { use_auto_pairing: false },
      {
        onSuccess: (res) => {
          const rec = res?.data ?? null;
          setRecommendation(rec);
          const suggested = rec?.suggested_team ?? [];
          if (suggested.length > 0) setSelectedIds(suggested.map((t) => t.technician_id).filter(Boolean));
        },
      }
    );
  }

  function toggleCandidate(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleSubmit() {
    if (!useAuto && selectedIds.length < 1) return;
    mutation.mutate(
      { technician_ids: selectedIds, use_auto_pairing: useAuto, override_current: override, note: note || undefined },
      { onSuccess: () => onClose() }
    );
  }

  const candidates = recommendation?.candidates ?? [];
  // Build name map from candidates + suggested_team + currentTeam so chips always show names
  const nameMap: Record<string, string> = {};
  currentTeam.forEach((t) => { if (t.technician_id) nameMap[t.technician_id] = t.technician_name; });
  (recommendation?.suggested_team ?? []).forEach((t) => { if (t.technician_id) nameMap[t.technician_id] = t.technician_name; });
  candidates.forEach((c) => { nameMap[c.technician_id] = c.technician_name; });

  const seniorCandidates = candidates.filter((c) => c.level === "senior" || c.level === "lead");
  const juniorCandidates = candidates.filter((c) => c.level === "junior");

  return (
    <ModalShell
      title={isReassign ? "Reassign Pairing" : "Assign Pairing"}
      subtitle={workOrderNumber}
      onClose={onClose}
      widthClass="max-w-2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={mutation.isPending || (!useAuto && selectedIds.length === 0)}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {isReassign ? "Reassign" : "Assign"} {!useAuto && selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Auto-pair toggle */}
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${useAuto ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800" : "border-slate-200 dark:border-slate-700"}`}>
          <input id="use_auto" type="checkbox" checked={useAuto} onChange={(e) => setUseAuto(e.target.checked)} className="mt-0.5" />
          <label htmlFor="use_auto" className="flex-1 cursor-pointer">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Auto Pairing</p>
            <p className="text-xs text-slate-500 mt-0.5">System picks best available Senior + Junior pair automatically.</p>
          </label>
        </div>

        {!useAuto && (
          <>
            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div>
                <FieldLabel>Selected Team ({selectedIds.length})</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id) => {
                    const name = nameMap[id] ?? id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        <User className="size-3" />
                        {name}
                        <button onClick={() => setSelectedIds((p) => p.filter((x) => x !== id))} className="hover:text-rose-500 transition-colors">
                          <X className="size-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommend CTA */}
            {!recommendation ? (
              <Button variant="primary" size="sm" onClick={handleRecommend} disabled={recommendMutation.isPending} className="w-full gap-2">
                {recommendMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Get Recommendation
              </Button>
            ) : (
              <div className="space-y-4">
                {recommendation.priority_reason && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Priority · {recommendation.priority}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{recommendation.priority_reason}</p>
                    </div>
                  </div>
                )}

                {seniorCandidates.length > 0 && (
                  <div>
                    <FieldLabel>Senior / Lead</FieldLabel>
                    <div className="space-y-2">
                      {seniorCandidates.map((c) => (
                        <CandidateCard key={c.technician_id} candidate={c} selected={selectedIds.includes(c.technician_id)} onToggle={() => toggleCandidate(c.technician_id)} />
                      ))}
                    </div>
                  </div>
                )}

                {juniorCandidates.length > 0 && (
                  <div>
                    <FieldLabel>Junior</FieldLabel>
                    <div className="space-y-2">
                      {juniorCandidates.map((c) => (
                        <CandidateCard key={c.technician_id} candidate={c} selected={selectedIds.includes(c.technician_id)} onToggle={() => toggleCandidate(c.technician_id)} />
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleRecommend} disabled={recommendMutation.isPending} className="text-[11px] text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                  {recommendMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                  Refresh
                </button>
              </div>
            )}
          </>
        )}

        {isReassign && (
          <div className={`flex items-start gap-3 p-3 rounded-lg border ${override ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800" : "border-slate-200 dark:border-slate-700"}`}>
            <input id="override" type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} className="mt-0.5" />
            <label htmlFor="override" className="flex-1 cursor-pointer">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Override Current Assignment</p>
              <p className="text-xs text-slate-500 mt-0.5">Replaces current team. Existing technicians will be notified.</p>
            </label>
          </div>
        )}

        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional context for the team..." className="min-h-[70px]" />
        </div>
      </div>
    </ModalShell>
  );
}
