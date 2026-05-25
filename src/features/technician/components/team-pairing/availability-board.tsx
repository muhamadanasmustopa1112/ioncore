"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, History } from "lucide-react";
import type { TechnicianAvailabilityItem, TechnicianAvailabilityStatus, TechnicianLevel } from "../../types/technician-api";
import { TechnicianHistoryModal } from "../technician-detail/modals/technician-history";

const AVAILABILITY_VARIANT: Record<TechnicianAvailabilityStatus, "success" | "warning" | "destructive" | "info"> = {
  available: "success",
  on_leave: "destructive",
  on_other_wo: "warning",
  cross_area: "info",
};

const LEVEL_VARIANT: Record<TechnicianLevel, "primary" | "info" | "warning"> = {
  senior: "primary",
  junior: "info",
  lead: "warning",
};

function humanize(s: string | undefined | null) {
  if (!s) return "—";
  return s.replace(/_/g, " ");
}

function TechnicianRow({ tech }: { tech: TechnicianAvailabilityItem }) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);

  const levelLower = tech.level.toLowerCase();
  const translatedLevel = levelLower === "senior" || levelLower === "lead"
    ? t("workOrder.detail.modals.pairing.seniorLead")
    : levelLower === "junior"
      ? t("workOrder.detail.modals.pairing.junior")
      : tech.level;

  const availabilityText = tech.availability_status === "available"
    ? t("workOrder.detail.modals.pairing.available")
    : tech.availability_status === "on_leave"
      ? t("workOrder.teamPairing.status.onLeave", "On Leave")
      : tech.availability_status === "on_other_wo"
        ? t("workOrder.teamPairing.status.onOtherWo", "On Other WO")
        : tech.availability_status === "cross_area"
          ? t("workOrder.detail.crossArea")
          : (tech.availability_status as string).replace(/_/g, " ");

  const activeWoText = t(tech.active_workload === 1 ? "workOrder.detail.modals.pairing.activeWo" : "workOrder.detail.modals.pairing.activeWos", { count: tech.active_workload }).replace(String(tech.active_workload), "").trim();

  return (
    <>
      <div className="flex items-center gap-3 p-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
        <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-slate-500">
            {tech.technician_name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{tech.technician_name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant={LEVEL_VARIANT[tech.level] ?? "primary"} appearance="light" size="sm" className="uppercase">
              {translatedLevel}
            </Badge>
            <Badge variant={AVAILABILITY_VARIANT[tech.availability_status || tech.availability_status] ?? "info"} appearance="light" size="sm" className="capitalize">
              {availabilityText}
            </Badge>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{tech.active_workload}</p>
          <p className="text-[10px] text-slate-400">{activeWoText}</p>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="shrink-0 text-slate-300 hover:text-primary transition-colors ml-1"
          title="View WO history"
        >
          <History className="size-4" />
        </button>
      </div>
      {showHistory && (
        <TechnicianHistoryModal
          technicianId={tech.technician_id}
          technicianName={tech.technician_name}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}

export function AvailabilityBoard({ technicians }: { technicians: TechnicianAvailabilityItem[] }) {
  const { t } = useTranslation();
  const available = technicians.filter((t) => (t.availability_status || t.availability_status) === "available");
  const busy = technicians.filter((t) => (t.availability_status || t.availability_status) !== "available");

  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Users className="size-4 text-primary" />
          {t("workOrder.teamPairing.availabilityBoard")}
          <Badge variant="success" appearance="light" size="sm">{t("workOrder.teamPairing.free", { count: available.length })}</Badge>
          <Badge variant="warning" appearance="light" size="sm">{t("workOrder.teamPairing.busy", { count: busy.length })}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[480px] overflow-y-auto">
        {technicians.length === 0 ? (
          <p className="text-sm text-slate-400 italic p-4">{t("workOrder.teamPairing.noTechnicianData")}</p>
        ) : (
          <>
            {available.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/5 border-b border-slate-100 dark:border-slate-800">
                  {t("workOrder.teamPairing.availableWithCount", { count: available.length })}
                </p>
                {available.map((t) => <TechnicianRow key={t.technician_id} tech={t} />)}
              </div>
            )}
            {busy.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  {t("workOrder.teamPairing.unavailableWithCount", { count: busy.length })}
                </p>
                {busy.map((t) => <TechnicianRow key={t.technician_id} tech={t} />)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
