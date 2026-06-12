"use client";

import { useState } from "react";
import { Loader2, Sparkles, X, AlertTriangle, User, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAssignPairing,
  useUpdatePairing,
  usePairingRecommendation,
} from "../../../api/team-leader";
import { useTechnicianList } from "../../../api/dashboard";
import { useBranchScope } from "@/hooks/use-branch-scope";
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
  const { t } = useTranslation();
  const lc = LEVEL_COLOR[candidate.level] ?? LEVEL_COLOR.junior;
  const initials = candidate.technician_name
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const levelLower = candidate.level.toLowerCase();
  const translatedLevel = levelLower === "senior" || levelLower === "lead"
    ? t("workOrder.detail.modals.pairing.seniorLead")
    : levelLower === "junior"
      ? t("workOrder.detail.modals.pairing.junior")
      : candidate.level;

  const availabilityText = candidate.availability_status === "available"
    ? t("workOrder.detail.modals.pairing.available")
    : candidate.availability_status.replace(/_/g, " ");

  const activeWoText = t(candidate.active_workload === 1 ? "workOrder.detail.modals.pairing.activeWo" : "workOrder.detail.modals.pairing.activeWos", { count: candidate.active_workload });

  return (
    <button
      disabled={candidate.availability_status !== "available"}
      onClick={onToggle}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selected
        ? "border-primary bg-primary/5 dark:bg-primary/10"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40"
        } ${candidate.availability_status !== "available" ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`size-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ring-2 ${lc.bg} ${lc.text} ${lc.ring}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold truncate">{candidate.technician_name}</span>
            <Badge variant={candidate.level === "senior" ? "primary" : "info"} appearance="light" size="sm" className="uppercase shrink-0">
              {translatedLevel}
            </Badge>
            {candidate.availability_status && (
              <Badge
                variant={candidate.availability_status === "available" ? "success" : "warning"}
                appearance="light"
                size="sm"
                className="shrink-0 uppercase"
              >
                {availabilityText}
              </Badge>
            )}
          </div>
          <ScoreBar score={candidate.match_score} />
          <div className="flex flex-wrap items-center gap-x-3 mt-1.5 text-[10px] text-slate-500">
            <span className="font-medium">{activeWoText}</span>
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
  const { t } = useTranslation();
  const isReassign = currentTeam.length > 0;
  const [useAuto, setUseAuto] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentTeam.map((tech) => tech.technician_id));
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

  const { isBranchScoped } = useBranchScope("work_orders");

  const { data: allTechnicians = [], isLoading: isTechListLoading } = useTechnicianList({
    params: {
      ...(isBranchScoped ? { branch_id: branchId, team_leader_id: teamLeaderId } : {}),
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
          if (suggested.length > 0) setSelectedIds(suggested.map((tech) => tech.technician_id).filter(Boolean));
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
        ...allTechnicians.map(tech => ({ id: tech.technician_id, level: tech.level })),
        ...(recommendation?.candidates ?? []).map(c => ({ id: c.technician_id, level: c.level })),
        ...currentTeam.map(tech => ({ id: tech.technician_id, level: tech.level })),
        ...(recommendation?.suggested_team ?? []).map(tech => ({ id: tech.technician_id, level: tech.level })),
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
    currentTeam.forEach((tech) => { if (tech.technician_id) map[tech.technician_id] = tech.technician_name; });
    (recommendation?.suggested_team ?? []).forEach((tech) => { if (tech.technician_id) map[tech.technician_id] = tech.technician_name; });
    (recommendation?.candidates ?? []).forEach((c) => { map[c.technician_id] = c.technician_name; });
    allTechnicians.forEach((tech) => { map[tech.technician_id] = tech.technician_name; });

    const beforeTeam = currentTeam.map(tech => ({ id: tech.technician_id, name: tech.technician_name || map[tech.technician_id] }));
    const afterTeam = selectedIds.map(id => ({ id, name: map[id] || "Unknown Technician" }));

    mutation.mutate(
      { id: workOrderId, data: { technician_ids: selectedIds, use_auto_pairing: useAuto, override_current: override, note: note || undefined } },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  }

  const candidates = recommendation?.candidates ?? [];
  const nameMap: Record<string, string> = {};
  currentTeam.forEach((tech) => { if (tech.technician_id) nameMap[tech.technician_id] = tech.technician_name; });
  (recommendation?.suggested_team ?? []).forEach((tech) => { if (tech.technician_id) nameMap[tech.technician_id] = tech.technician_name; });
  candidates.forEach((c) => { nameMap[c.technician_id] = c.technician_name; });
  allTechnicians.forEach((tech) => { nameMap[tech.technician_id] = tech.technician_name; });

  const seniorCandidates = candidates.filter((c) => c.level === "senior" || c.level === "lead");
  const juniorCandidates = candidates.filter((c) => c.level === "junior");

  // Map the raw ListTechnicianItem to DispatchCandidate format for manual rendering
  const mappedAllCandidates: DispatchCandidate[] = allTechnicians.map((tech) => ({
    technician_id: tech.technician_id,
    technician_name: tech.technician_name,
    level: tech.level as any,
    active_workload: tech.active_workload,
    skills: tech.skills,
    match_score: tech.level === "senior" ? 85 : tech.level === "lead" ? 90 : 65,
    reasons: [`${t("workOrder.detail.area")}: ${tech.area_id?.replace("area-", "")?.toUpperCase() || "UNKNOWN"}`],
    cross_area: tech.cross_area_enabled ?? false,
    area_id: tech.area_id,
    sub_area_id: tech.sub_area_id,
    availability_status: tech.availability_status,
  }));

  const filteredAllCandidates = mappedAllCandidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.technician_name.toLowerCase().includes(q) ||
      c.level.toLowerCase().includes(q) ||
      (c.area_id ?? "").toLowerCase().includes(q);

    return matchesSearch;
  });

  return (
    <ModalShell
      title={isReassign ? t("workOrder.detail.reassignPairing") : t("workOrder.detail.assignPairing")}
      subtitle={workOrderNumber}
      onClose={onClose}
      widthClass="max-w-2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {isReassign ? t("workOrder.detail.reassignPairing") : t("workOrder.detail.assignPairing")} {!useAuto && selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
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
                {t("workOrder.detail.modals.pairing.validationError")}
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
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{t("workOrder.detail.modals.pairing.autoPairing")}</p>
            <p className="text-xs text-slate-500 mt-0.5">{t("workOrder.detail.modals.pairing.autoPairingSub")}</p>
          </label>
        </div>

        {!useAuto && (
          <>
            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div>
                <FieldLabel>{t("workOrder.detail.modals.pairing.selectedTeam", { count: selectedIds.length })}</FieldLabel>
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
                  {t("workOrder.detail.modals.pairing.recommended")}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${viewMode === "all"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {t("workOrder.detail.modals.pairing.allTechnicians", { count: allTechnicians.length })}
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
                  {t("workOrder.detail.modals.pairing.getRecommendation")}
                </Button>
              )}
            </div>

            {/* AI Recommended view */}
            {viewMode === "recommend" && (
              <>
                {!recommendation ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                    <Sparkles className="size-6 text-primary/40 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">{t("workOrder.detail.modals.pairing.recommendationPlaceholder")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendation.priority_reason && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                            {(() => {
                              const priorityLower = recommendation.priority?.toLowerCase();
                              const translatedPriority = t(`technician.priority.${priorityLower}`) && !t(`technician.priority.${priorityLower}`).startsWith("technician.priority")
                                ? t(`technician.priority.${priorityLower}`)
                                : recommendation.priority;
                              return t("workOrder.detail.modals.pairing.priorityTitle", { priority: translatedPriority });
                            })()}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{recommendation.priority_reason}</p>
                        </div>
                      </div>
                    )}

                    {seniorCandidates.length > 0 && (
                      <div>
                        <FieldLabel>{t("workOrder.detail.modals.pairing.seniorLead")}</FieldLabel>
                        <div className="space-y-2">
                          {seniorCandidates.map((c) => (
                            <CandidateCard key={c.technician_id} candidate={c} selected={selectedIds.includes(c.technician_id)} onToggle={() => toggleCandidate(c.technician_id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {juniorCandidates.length > 0 && (
                      <div>
                        <FieldLabel>{t("workOrder.detail.modals.pairing.junior")}</FieldLabel>
                        <div className="space-y-2">
                          {juniorCandidates.map((c) => (
                            <CandidateCard key={c.technician_id} candidate={c} selected={selectedIds.includes(c.technician_id)} onToggle={() => toggleCandidate(c.technician_id)} />
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={handleRecommend} disabled={recommendMutation.isPending} className="text-[11px] text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
                      {recommendMutation.isPending ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                      {t("workOrder.detail.modals.pairing.refreshRecommendation")}
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
                    <p className="text-xs text-slate-400">{t("workOrder.detail.modals.pairing.directoryLoading")}</p>
                  </div>
                ) : allTechnicians.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400">
                    {t("workOrder.detail.modals.pairing.directoryEmpty")}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("workOrder.detail.modals.pairing.searchPlaceholder")}
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
                          {t("common.clear") || "Clear"}
                        </button>
                      )}
                    </div>

                    {/* Compact Filtered List */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 scrollbar-thin">
                      {filteredAllCandidates.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 italic">
                          {t("workOrder.detail.modals.pairing.noMatching")}
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

                          const levelLower = c.level.toLowerCase();
                          const translatedLevel = levelLower === "senior" || levelLower === "lead"
                            ? t("workOrder.detail.modals.pairing.seniorLead")
                            : levelLower === "junior"
                              ? t("workOrder.detail.modals.pairing.junior")
                              : c.level;

                          const availabilityText = c.availability_status === "available"
                            ? t("workOrder.detail.modals.pairing.available")
                            : c.availability_status.replace(/_/g, " ");

                          const activeWoText = t(c.active_workload === 1 ? "workOrder.detail.modals.pairing.activeWo" : "workOrder.detail.modals.pairing.activeWos", { count: c.active_workload });

                          return (
                            <button
                              key={c.technician_id}
                              type="button"
                              disabled={c.availability_status !== "available"}
                              onClick={() => toggleCandidate(c.technician_id)}
                              className={`w-full flex items-center justify-between p-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                                } ${c.availability_status !== "available" ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ring-1 ${lc.bg} ${lc.text} ${lc.ring}`}>
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{c.technician_name}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${lc.bg} ${lc.text}`}>
                                      {translatedLevel}
                                    </span>
                                    {c.availability_status && (
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${c.availability_status === "available"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                        }`}>
                                        {availabilityText}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                    {t("workOrder.detail.area")}: <span className="uppercase text-slate-500 font-bold">{c.area_id?.replace("area-", "") || "UNKNOWN"}</span> · {activeWoText}
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
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{t("workOrder.detail.modals.pairing.overrideCurrent")}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t("workOrder.detail.modals.pairing.overrideCurrentSub")}</p>
            </label>
          </div>
        )}

        <div>
          <FieldLabel>{t("workOrder.detail.note")}</FieldLabel>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("workOrder.detail.modals.pairing.optionalContext")} className="min-h-[70px]" />
        </div>
      </div>
    </ModalShell>
  );
}
