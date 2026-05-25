"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useCancelWorkOrder } from "../../../api/actions";
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
  const { t } = useTranslation();
  const [reasonCode, setReasonCode] = useState("");
  const [note, setNote] = useState("");

  const mutation = useCancelWorkOrder();

  function handleSubmit() {
    if (!reasonCode.trim()) return;
    mutation.mutate(
      { id: workOrderId, data: { reason_code: reasonCode, note: note || undefined } },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <ModalShell
      title={t("workOrder.detail.modals.cancel.title")}
      subtitle={workOrderNumber}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("workOrder.detail.modals.crossArea.cancel") || t("common.cancel") || "Back"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSubmit}
            disabled={!reasonCode || mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {t("workOrder.detail.modals.cancel.confirmCancel")}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <FieldLabel required>{t("workOrder.detail.modals.cancel.reasonCode")}</FieldLabel>
          <select
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-outline rounded text-sm py-2 px-3"
          >
            <option value="">{t("workOrder.detail.modals.cancel.selectReason")}</option>
            <option value="customer_request">{t("workOrder.detail.modals.cancel.customerRequest")}</option>
            <option value="customer_no_show">{t("workOrder.detail.modals.cancel.customerNoShow")}</option>
            <option value="address_unreachable">{t("workOrder.detail.modals.cancel.addressUnreachable")}</option>
            <option value="duplicate">{t("workOrder.detail.modals.cancel.duplicateOrder")}</option>
            <option value="infrastructure_unavailable">{t("workOrder.detail.modals.cancel.infrastructureUnavailable")}</option>
            <option value="other">{t("workOrder.detail.modals.cancel.other")}</option>
          </select>
        </div>
        <div>
          <FieldLabel>{t("workOrder.detail.note")}</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("workOrder.detail.modals.cancel.optionalDetails")}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
