"use client";

import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModalShell, FieldLabel } from "./shell";
import { useAutoAssignWorkOrders } from "@/features/technician/api/team-leader";

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
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const mutation = useAutoAssignWorkOrders();

  function handleSubmit() {
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
      title={t("workOrder.detail.modals.autoAssign.title")}
      subtitle={t("workOrder.detail.modals.autoAssign.subtitle")}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {t("workOrder.detail.modals.autoAssign.trigger")}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <Users className="size-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t("workOrder.detail.modals.autoAssign.hint")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {branchId && <ScopeField label={t("workOrder.detail.branch")} value={branchId} />}
          {areaId && <ScopeField label={t("workOrder.detail.area")} value={areaId} />}
          {subAreaId && <ScopeField label={t("workOrder.detail.subArea")} value={subAreaId} />}
          {!branchId && !areaId && !subAreaId && (
            <p className="text-slate-400 italic col-span-2">
              {t("workOrder.detail.modals.autoAssign.noScopeFilters")}
            </p>
          )}
        </div>
        <div>
          <FieldLabel required>{t("workOrder.detail.modals.autoAssign.operatingDate")}</FieldLabel>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <FieldLabel>{t("workOrder.detail.note")}</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("workOrder.detail.modals.autoAssign.optionalContext")}
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
