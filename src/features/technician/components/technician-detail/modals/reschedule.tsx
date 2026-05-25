"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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

  const isIndo = t("workOrder.detail.no").toLowerCase() === "tidak";

  return (
    <ModalShell
      title={t("workOrder.detail.modals.reschedule.title")}
      subtitle={workOrderNumber}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!scheduledAt || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {t("common.save") || "Save"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <FieldLabel required>{t("workOrder.detail.modals.reschedule.newScheduled")}</FieldLabel>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>{t("workOrder.detail.modals.reschedule.priority")}</FieldLabel>
          <div className="grid grid-cols-4 gap-2">
            {(["low", "medium", "high", "urgent"] as const).map((p) => {
              const priorityText = t(`technician.priority.${p}`).startsWith("technician.priority")
                ? (p === "urgent" ? (isIndo ? "Mendesak" : "Urgent") : p)
                : t(`technician.priority.${p}`);
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-2 py-2 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    priority === p
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary"
                  }`}
                >
                  {priorityText}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <FieldLabel>{t("workOrder.detail.note")}</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("workOrder.detail.modals.reschedule.reason")}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
