"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCancelWorkOrder } from "../../../api/technician-queries";
import { ModalShell, FieldLabel } from "./shell";

export function CancelModal({
  workOrderId,
  workOrderNumber,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  onClose: () => void;
}) {
  const [reasonCode, setReasonCode] = useState("");
  const [note, setNote] = useState("");

  const mutation = useCancelWorkOrder(workOrderId);

  function handleSubmit() {
    if (!reasonCode.trim()) return;
    mutation.mutate(
      { reason_code: reasonCode, note: note || undefined },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <ModalShell
      title="Cancel Work Order"
      subtitle={workOrderNumber}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Back
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSubmit}
            disabled={!reasonCode || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            Confirm Cancel
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>Reason Code</FieldLabel>
          <select
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-outline rounded text-sm py-2 px-3"
          >
            <option value="">Select reason</option>
            <option value="customer_request">Customer Request</option>
            <option value="customer_no_show">Customer No-show</option>
            <option value="address_unreachable">Address Unreachable</option>
            <option value="duplicate">Duplicate Order</option>
            <option value="infrastructure_unavailable">Infrastructure Unavailable</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional details..."
            className="min-h-[80px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
