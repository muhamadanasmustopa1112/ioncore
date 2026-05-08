"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWorkOrder } from "../../../api/actions";
import type { WorkOrderPriority } from "../../../types/technician-api";
import { ModalShell, FieldLabel } from "./shell";

export function RescheduleModal({
  workOrderId,
  workOrderNumber,
  currentSchedule,
  currentPriority,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  currentSchedule: string | undefined;
  currentPriority: WorkOrderPriority | undefined;
  onClose: () => void;
}) {
  const [scheduledAt, setScheduledAt] = useState(
    currentSchedule ? new Date(currentSchedule).toISOString().slice(0, 16) : ""
  );
  const [priority, setPriority] = useState<WorkOrderPriority>(currentPriority ?? "medium");
  const [note, setNote] = useState("");

  const mutation = useUpdateWorkOrder();

  function handleSubmit() {
    if (!scheduledAt) return;
    mutation.mutate(
      {
        id: workOrderId,
        data: {
          requested_installation: new Date(scheduledAt).toISOString(),
          priority,
          note: note || undefined,
        },
      },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <ModalShell
      title="Reschedule Work Order"
      subtitle={workOrderNumber}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!scheduledAt || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <FieldLabel required>New Scheduled Date / Time</FieldLabel>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Priority</FieldLabel>
          <div className="grid grid-cols-4 gap-2">
            {(["low", "medium", "high", "urgent"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  priority === p
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Reason for reschedule..."
            className="min-h-[80px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
