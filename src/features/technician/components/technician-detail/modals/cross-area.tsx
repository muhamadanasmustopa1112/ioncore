"use client";

import { useState } from "react";
import { Loader2, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCrossAreaRequest } from "../../../api/technician-queries";
import { ModalShell, FieldLabel } from "./shell";

export function CrossAreaModal({
  workOrderId,
  workOrderNumber,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  onClose: () => void;
}) {
  const [lendingAreaId, setLendingAreaId] = useState("");
  const [lendingLeaderId, setLendingLeaderId] = useState("");
  const [lendingLeaderName, setLendingLeaderName] = useState("");
  const [requestingLeaderName, setRequestingLeaderName] = useState("");
  const [candidatesText, setCandidatesText] = useState("");
  const [note, setNote] = useState("");

  const mutation = useCreateCrossAreaRequest(workOrderId);

  const candidates = candidatesText
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const ready =
    lendingAreaId &&
    lendingLeaderId &&
    lendingLeaderName &&
    requestingLeaderName &&
    candidates.length > 0;

  function handleSubmit() {
    if (!ready) return;
    mutation.mutate(
      {
        lending_area_id: lendingAreaId,
        lending_leader_id: lendingLeaderId,
        lending_leader_name: lendingLeaderName,
        requesting_leader_name: requestingLeaderName,
        candidate_technician_ids: candidates,
        note: note || undefined,
      },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <ModalShell
      title="Cross-Area Request"
      subtitle={`${workOrderNumber} · borrow technicians from another area`}
      onClose={onClose}
      widthClass="max-w-lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!ready || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            Send Request
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <Network className="size-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Use when no available technicians in current area. Lending team leader must approve.
          </p>
        </div>
        <div>
          <FieldLabel required>Your Name</FieldLabel>
          <Input
            value={requestingLeaderName}
            onChange={(e) => setRequestingLeaderName(e.target.value)}
            placeholder="Requesting leader name"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Lending Area ID</FieldLabel>
            <Input
              value={lendingAreaId}
              onChange={(e) => setLendingAreaId(e.target.value)}
              placeholder="area-xyz"
            />
          </div>
          <div>
            <FieldLabel required>Lending Leader ID</FieldLabel>
            <Input
              value={lendingLeaderId}
              onChange={(e) => setLendingLeaderId(e.target.value)}
              placeholder="leader-xyz"
            />
          </div>
        </div>
        <div>
          <FieldLabel required>Lending Leader Name</FieldLabel>
          <Input
            value={lendingLeaderName}
            onChange={(e) => setLendingLeaderName(e.target.value)}
            placeholder="Approver's full name"
          />
        </div>
        <div>
          <FieldLabel required>Candidate Technician IDs</FieldLabel>
          <Textarea
            value={candidatesText}
            onChange={(e) => setCandidatesText(e.target.value)}
            placeholder="One ID per line"
            className="min-h-[80px] font-mono text-xs"
          />
          <p className="text-[10px] text-slate-400 mt-1">{candidates.length} candidates</p>
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason / urgency..."
            className="min-h-[70px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
