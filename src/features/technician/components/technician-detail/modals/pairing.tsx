"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
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
} from "../../../types/technician-api";
import { ModalShell, FieldLabel } from "./shell";

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
  const [techIdsText, setTechIdsText] = useState(
    currentTeam.map((t) => t.technician_id).join("\n")
  );
  const [override, setOverride] = useState(isReassign);
  const [note, setNote] = useState("");
  const [recommendation, setRecommendation] = useState<{
    suggested: AssignedTechnician[];
    candidates: DispatchCandidate[];
  } | null>(null);

  const assignMutation = useAssignPairing(workOrderId);
  const updateMutation = useUpdatePairing(workOrderId);
  const recommendMutation = usePairingRecommendation(workOrderId);
  const mutation = isReassign ? updateMutation : assignMutation;

  function handleRecommend() {
    recommendMutation.mutate(
      { use_auto_pairing: false },
      {
        onSuccess: (res) => {
          setRecommendation({
            suggested: res?.data?.suggested_team ?? [],
            candidates: res?.data?.candidates ?? [],
          });
          const ids = (res?.data?.suggested_team ?? [])
            .map((t) => t.technician_id)
            .filter(Boolean);
          if (ids.length > 0) setTechIdsText(ids.join("\n"));
        },
      }
    );
  }

  function toggleCandidate(id: string) {
    const ids = parseIds(techIdsText);
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setTechIdsText(next.join("\n"));
  }

  function handleSubmit() {
    const ids = parseIds(techIdsText);
    if (!useAuto && ids.length < 1) return;
    mutation.mutate(
      {
        technician_ids: ids,
        use_auto_pairing: useAuto,
        override_current: override,
        note: note || undefined,
      },
      { onSuccess: () => onClose() }
    );
  }

  const selectedIds = parseIds(techIdsText);

  return (
    <ModalShell
      title={isReassign ? "Reassign Pairing" : "Assign Pairing"}
      subtitle={`${workOrderNumber} · 1 Senior + 1 Junior recommended`}
      onClose={onClose}
      widthClass="max-w-2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={mutation.isPending || (!useAuto && selectedIds.length === 0)}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {isReassign ? "Reassign" : "Assign"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <ToggleBlock
          id="use_auto"
          checked={useAuto}
          onChange={setUseAuto}
          tone="blue"
          title="Use Auto Pairing"
          description="System picks best available Senior + Junior pair in area."
        />

        {!useAuto && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel required>Technician IDs</FieldLabel>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRecommend}
                  disabled={recommendMutation.isPending}
                  className="text-[10px]"
                >
                  {recommendMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="size-3 mr-1" />
                  )}
                  Recommend
                </Button>
              </div>
              <Textarea
                value={techIdsText}
                onChange={(e) => setTechIdsText(e.target.value)}
                placeholder="One technician ID per line"
                className="min-h-[80px] font-mono text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">{selectedIds.length} selected</p>
            </div>

            {recommendation && recommendation.candidates.length > 0 && (
              <CandidateList
                candidates={recommendation.candidates}
                selectedIds={selectedIds}
                onToggle={toggleCandidate}
              />
            )}
          </>
        )}

        {isReassign && (
          <ToggleBlock
            id="override"
            checked={override}
            onChange={setOverride}
            tone="amber"
            title="Override Current Assignment"
            description="Replaces current team. Existing technicians will be notified."
          />
        )}

        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional context for the team..."
            className="min-h-[70px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function parseIds(text: string): string[] {
  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function ToggleBlock({
  id,
  checked,
  onChange,
  tone,
  title,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tone: "blue" | "amber";
  title: string;
  description: string;
}) {
  const toneClass =
    tone === "blue"
      ? "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
      : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30";
  const titleClass =
    tone === "blue" ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400";
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${toneClass}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5"
      />
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <p className={`text-sm font-semibold ${titleClass}`}>{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </label>
    </div>
  );
}

function CandidateList({
  candidates,
  selectedIds,
  onToggle,
}: {
  candidates: DispatchCandidate[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <FieldLabel>Candidates</FieldLabel>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
        {candidates.map((c) => {
          const checked = selectedIds.includes(c.technician_id);
          return (
            <label
              key={c.technician_id}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(c.technician_id)}
                className="mt-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{c.technician_name}</p>
                  <Badge
                    variant={c.level === "senior" ? "primary" : "info"}
                    appearance="light"
                    size="sm"
                    className="uppercase shrink-0"
                  >
                    {c.level}
                  </Badge>
                  {c.cross_area && (
                    <Badge variant="warning" appearance="light" size="sm">
                      Cross-area
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Score: {c.match_score} · Workload: {c.active_workload}
                </p>
                {c.reasons && c.reasons.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.reasons.join(" · ")}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
