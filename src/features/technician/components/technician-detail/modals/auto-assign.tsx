"use client";

import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAutoAssignWorkOrders } from "../../../api/technician-queries";
import { ModalShell, FieldLabel } from "./shell";

export function AutoAssignModal({
  branchId,
  areaId,
  subAreaId,
  onClose,
}: {
  branchId?: string;
  areaId?: string;
  subAreaId?: string;
  onClose: () => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const mutation = useAutoAssignWorkOrders();

  function handleSubmit() {
    // API expects RFC3339 (Go time.Time); date picker gives YYYY-MM-DD
    const dateRFC = new Date(`${date}T00:00:00Z`).toISOString();
    mutation.mutate(
      {
        branch_id: branchId,
        area_id: areaId,
        sub_area_id: subAreaId,
        date: dateRFC,
        note: note || undefined,
      },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <ModalShell
      title="Auto-Assign Batch"
      subtitle="Assign all unassigned WOs in scope"
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            Trigger Auto-Assign
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <Users className="size-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            System pairs Senior + Junior technicians automatically based on availability and area.
            WOs that can&apos;t be paired become overflow.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {branchId && <ScopeField label="Branch" value={branchId} />}
          {areaId && <ScopeField label="Area" value={areaId} />}
          {subAreaId && <ScopeField label="Sub Area" value={subAreaId} />}
          {!branchId && !areaId && !subAreaId && (
            <p className="text-slate-400 italic col-span-2">
              No scope filters — runs across all areas.
            </p>
          )}
        </div>
        <div>
          <FieldLabel required>Operating Date</FieldLabel>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional context..."
            className="min-h-[70px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function ScopeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-400 uppercase tracking-wider text-[10px] mb-0.5">{label}</p>
      <p className="font-mono">{value}</p>
    </div>
  );
}
