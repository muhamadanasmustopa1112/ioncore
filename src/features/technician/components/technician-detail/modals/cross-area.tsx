"use client";

import { useState, useMemo } from "react";
import { Loader2, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCrossAreaRequest } from "../../../api/cross-area";
import { useTechnicianList } from "../../../api/dashboard";
import { MultiSelect } from "@/components/ui/multi-select";
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
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [note, setNote] = useState("");

  const { data: allTechnicians = [], isLoading: isTechListLoading } = useTechnicianList();

  const handleCandidatesChange = (newCandidates: string[]) => {
    setSelectedCandidates(newCandidates);
    if (newCandidates.length > 0) {
      const firstId = newCandidates[0];
      const tech = allTechnicians.find((t: any) => t.technician_id === firstId);
      if (tech) {
        if (tech.team_leader) {
          setLendingLeaderId(tech.team_leader.id || "");
          setLendingLeaderName(tech.team_leader.name || "");
          setLendingAreaId(tech.team_leader.area_id || tech.area_id || "");
        } else {
          setLendingAreaId(tech.area_id || "");
        }
      }
    } else {
      setLendingAreaId("");
      setLendingLeaderId("");
      setLendingLeaderName("");
    }
  };

  const mutation = useCreateCrossAreaRequest();

  const options = useMemo(() => {
    return allTechnicians.map((t) => ({
      value: t.technician_id,
      label: `${t.technician_name} (${t.level.toUpperCase()})`,
    }));
  }, [allTechnicians]);

  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const candidates = selectedCandidates;

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
        workOrderId,
        data: {
          lending_area_id: lendingAreaId,
          lending_leader_id: lendingLeaderId,
          lending_leader_name: lendingLeaderName,
          requesting_leader_name: requestingLeaderName,
          candidate_technician_ids: candidates,
          note: note || undefined,
        },
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
        <div>
          <FieldLabel required>Candidate Technicians</FieldLabel>
          <div className="w-full [&>button]:h-10">
            <MultiSelect
              value={selectedCandidates}
              onChange={handleCandidatesChange}
              filteredText="Technicians"
              placeholder="Select candidate technicians..."
              className="w-full text-xs font-semibold"
              options={filteredOptions}
              isLoading={isTechListLoading}
              onSearch={setSearchQuery}
              maxHeight="250px"
              emptyText="No technicians found"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{candidates.length} candidates selected</p>
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
