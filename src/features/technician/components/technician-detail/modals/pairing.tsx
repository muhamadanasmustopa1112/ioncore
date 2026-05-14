"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, AlertTriangle, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignPairing,
  useUpdatePairing,
  usePairingRecommendation,
} from "../../../api/team-leader";
import { useTechnicianList } from "../../../api/dashboard";
import { useAuthStore } from "@/store/auth-store";
import type {
  AssignedTechnician,
  DispatchCandidate,
  PairingRecommendationResponse,
} from "../../../types/technician-api";
import { ModalShell, FieldLabel } from "./shell";
import { createAuditLog } from "@/features/administration/audit-log/api/audit-log-api";

const LEVEL_COLOR: Record<string, { bg: string; text: string; ring: string }> = {
  senior: { bg: "bg-primary/10", text: "text-primary", ring: "ring-primary/30" },
  junior: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-300/30" },
  lead: { bg: "bg-amber-100 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-300/30" },
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
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selected
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
            {(candidate as any).availability_status && (
              <Badge
                variant={(candidate as any).availability_status === "available" ? "success" : "warning"}
                appearance="light"
                size="sm"
                className="shrink-0 uppercase"
              >
                {(candidate as any).availability_status}
              </Badge>
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
        <div className={`size-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${selected ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600"
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
  branchId,
  teamLeaderId,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  currentTeam: AssignedTechnician[];
  branchId?: string;
  teamLeaderId?: string;
  onClose: () => void;
}) {
  const isReassign = currentTeam.length > 0;
  const [useAuto, setUseAuto] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentTeam.map((t) => t.technician_id));
  const [override, setOverride] = useState(isReassign);
  const [note, setNote] = useState("");
  const [recommendation, setRecommendation] = useState<PairingRecommendationResponse | null>(null);
  const [viewMode, setViewMode] = useState<"recommend" | "all">("recommend");
  const [searchTerm, setSearchTerm] = useState("");
  const [validationError, setValidationError] = useState(false);

  const assignMutation = useAssignPairing();
  const updateMutation = useUpdatePairing();
  const recommendMutation = usePairingRecommendation();
  const mutation = isReassign ? updateMutation : assignMutation;

  const { rawUser } = useAuthStore();
  const isLeader = rawUser?.roles?.some((r) => (r.name || "").toLowerCase() === "team_leader");

  const { data: allTechnicians = [], isLoading: isTechListLoading } = useTechnicianList({
    params: {
      ...(isLeader ? { branch_id: branchId, team_leader_id: teamLeaderId } : {}),
    },
  });

  function handleRecommend() {
    recommendMutation.mutate(
      { id: workOrderId, data: { use_auto_pairing: false } },
      {
        onSuccess: (res) => {
          const rec = res?.data ?? null;
          setRecommendation(rec);
          setViewMode("recommend");
          const suggested = rec?.suggested_team ?? [];
          if (suggested.length > 0) setSelectedIds(suggested.map((t) => t.technician_id).filter(Boolean));
        },
      }
    );
  }

  function toggleCandidate(id: string) {
    setValidationError(false);
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleSubmit() {
    if (!useAuto && selectedIds.length < 1) return;

    const currentSelectedLevels = selectedIds.map(id => {
      const source = [
        ...allTechnicians.map(t => ({ id: t.technician_id, level: t.level })),
        ...(recommendation?.candidates ?? []).map(c => ({ id: c.technician_id, level: c.level })),
        ...currentTeam.map(t => ({ id: t.technician_id, level: t.level })),
        ...(recommendation?.suggested_team ?? []).map(t => ({ id: t.technician_id, level: t.level })),
      ].filter(x => !!x.id);
      const found = source.find(x => String(x.id) === String(id));
      return found?.level?.toString().toLowerCase().trim();
    });

    const hasSenior = currentSelectedLevels.some(lvl => lvl === "senior" || lvl === "lead");
    const isViolated = !useAuto && selectedIds.length > 0 && !hasSenior;

    if (isViolated) {
      setValidationError(true);
      return;
    }

    setValidationError(false);

    const map: Record<string, string> = {};
    currentTeam.forEach((t) => { if (t.technician_id) map[t.technician_id] = t.technician_name; });
    (recommendation?.suggested_team ?? []).forEach((t) => { if (t.technician_id) map[t.technician_id] = t.technician_name; });
    (recommendation?.candidates ?? []).forEach((c) => { map[c.technician_id] = c.technician_name; });
    allTechnicians.forEach((t) => { map[t.technician_id] = t.technician_name; });

    const beforeTeam = currentTeam.map(t => ({ id: t.technician_id, name: t.technician_name || map[t.technician_id] }));
    const afterTeam = selectedIds.map(id => ({ id, name: map[id] || "Unknown Technician" }));

    mutation.mutate(
      { id: workOrderId, data: { technician_ids: selectedIds, use_auto_pairing: useAuto, override_current: override, note: note || undefined } },
      {
        onSuccess: () => {
          // createAuditLog({
          //   action_type: "override",
          //   module: "technician_pairing",
          //   record_type: "work_order_assignment",
          //   record_id: workOrderId,
          //   record_identifier: workOrderNumber,
          //   before: { team: beforeTeam } as unknown as Record<string, unknown>,
          //   after: { team: afterTeam, use_auto: useAuto } as unknown as Record<string, unknown>,
          //   change_reason: note || "Pairing update executed",
          //   status: "success"
          // }).catch(() => console.warn("⚠️ Silent failure recording audit trace for pairing event"));

          onClose();
        }
      }
    );
  }

  const candidates = recommendation?.candidates ?? [];
  const nameMap: Record<string, string> = {};
  currentTeam.forEach((t) => { if (t.technician_id) nameMap[t.technician_id] = t.technician_name; });
  (recommendation?.suggested_team ?? []).forEach((t) => { if (t.technician_id) nameMap[t.technician_id] = t.technician_name; });
  candidates.forEach((c) => { nameMap[c.technician_id] = c.technician_name; });
  allTechnicians.forEach((t) => { nameMap[t.technician_id] = t.technician_name; });

  const seniorCandidates = candidates.filter((c) => c.level === "senior" || c.level === "lead");
  const juniorCandidates = candidates.filter((c) => c.level === "junior");

  // Map the raw ListTechnicianItem to DispatchCandidate format for manual rendering
  const mappedAllCandidates: DispatchCandidate[] = allTechnicians.map((t) => ({
    technician_id: t.technician_id,
    technician_name: t.technician_name,
    level: t.level as any,
    active_workload: t.active_workload,
    skills: t.skills,
    match_score: t.level === "senior" ? 85 : t.level === "lead" ? 90 : 65,
    reasons: [`Area: ${t.area_id?.replace("area-", "").toUpperCase() || "UNKNOWN"}`],
    cross_area: t.cross_area_enabled ?? false,
    area_id: t.area_id,
    sub_area_id: t.sub_area_id,
    availability_status: t.availability_status,
  }));

  const filteredAllCandidates = mappedAllCandidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.technician_name.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q) ||
      (c.area_id ?? "").toLowerCase().includes(q);

    return matchesSearch && (c as any).availability_status === "available";
  });

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
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {isReassign ? "Reassign" : "Assign"} {!useAuto && selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {validationError && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertTriangle className="size-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5 leading-relaxed">
                Setiap tim pairing wajib berisi setidaknya 1 teknisi level **Senior** atau **Lead**. Tim saat ini hanya berisi level Junior dan pengiriman ditolak oleh sistem.
              </p>
            </div>
          </div>
        )}

        {/* Auto-pair toggle */}
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${useAuto ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800" : "border-slate-200 dark:border-slate-700"}`}>
          <input
            id="use_auto"
            type="checkbox"
            checked={useAuto}
            onChange={(e) => {
              setUseAuto(e.target.checked);
              setValidationError(false); // Reset error if toggle changed
            }}
            className="mt-0.5"
          />
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

            {/* View switcher & recommendations CTA */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("recommend")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${viewMode === "recommend"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  Recommended
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${viewMode === "all"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  All Technicians ({allTechnicians.length})
                </button>
              </div>

              {viewMode === "recommend" && !recommendation && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRecommend}
                  disabled={recommendMutation.isPending}
                  className="gap-1 px-3"
                >
                  {recommendMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                  Get Recommendation
                </Button>
              )}
            </div>

            {/* AI Recommended view */}
            {viewMode === "recommend" && (
              <>
                {!recommendation ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                    <Sparkles className="size-6 text-primary/40 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Click &quot;Get Recommendation&quot; to fetch optimal candidates using the matching algorithm.</p>
                  </div>
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
                      Refresh Recommendation
                    </button>
                  </div>
                )}
              </>
            )}

            {/* All Technicians manual select view */}
            {viewMode === "all" && (
              <div className="space-y-4">
                {isTechListLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <p className="text-xs text-slate-400">Loading technician directory...</p>
                  </div>
                ) : allTechnicians.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                    No technicians found in the directory.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search technician by name, level, or area..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs py-2.5 px-3 pl-9 text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <Search className="size-4 text-slate-400 absolute left-3 top-3" />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-3 text-slate-400 hover:text-foreground text-xs font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Compact Filtered List */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 scrollbar-thin">
                      {filteredAllCandidates.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 italic">
                          No matching technicians found.
                        </div>
                      ) : (
                        filteredAllCandidates.map((c) => {
                          const isSelected = selectedIds.includes(c.technician_id);
                          const lc = LEVEL_COLOR[c.level] ?? LEVEL_COLOR.junior;
                          const initials = c.technician_name
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase();

                          return (
                            <button
                              key={c.technician_id}
                              type="button"
                              onClick={() => toggleCandidate(c.technician_id)}
                              className={`w-full flex items-center justify-between p-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                                }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ring-1 ${lc.bg} ${lc.text} ${lc.ring}`}>
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{c.technician_name}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${lc.bg} ${lc.text}`}>
                                      {c.level}
                                    </span>
                                    {(c as any).availability_status && (
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${(c as any).availability_status === "available"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                        }`}>
                                        {(c as any).availability_status.replace(/_/g, " ")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                    Area: <span className="uppercase text-slate-500 font-bold">{c.area_id?.replace("area-", "") || "UNKNOWN"}</span> · {c.active_workload} active WO
                                  </div>
                                </div>
                              </div>
                              <div className={`size-4 rounded-md border shrink-0 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary text-white" : "border-slate-300 dark:border-slate-600"
                                }`}>
                                {isSelected && <span className="text-[9px] font-black">✓</span>}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
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
