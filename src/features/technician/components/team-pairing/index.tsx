"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useTeamLeaderDashboard } from "../../api/team-leader";
import { useTechnicianLatestLocations } from "../../api/dashboard";
import { useAuthStore } from "@/store/auth-store";
import { AutoAssignModal } from "../technician-detail/modals";
import { PairingModal } from "../technician-detail/modals";
import type { WorkOrderDashboardItem, TechnicianLatestLocation } from "../../types/technician-api";
import { TeamPairingSummary } from "./summary";
import { QueueList } from "./queue-list";
import { AvailabilityBoard } from "./availability-board";
import { CrossAreaPanel } from "./cross-area-panel";
import dynamic from "next/dynamic";
import { STATE_I18N_KEY, TYPE_I18N_KEY } from "../technician-detail/shared";

function MapLoading() {
  const { t } = useTranslation();
  return (
    <div className="h-[320px] sm:h-[380px] w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        <Loader2 className="size-5 animate-spin" />
        {t("workOrder.teamPairing.initializingMap")}
      </div>
    </div>
  );
}

const TechnicianDispatchMap = dynamic<{ technicians?: TechnicianLatestLocation[] }>(() => import("./tech-map"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export function TeamPairingDashboard() {
  const { t } = useTranslation();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showAutoAssign, setShowAutoAssign] = useState(false);
  const [pairingTarget, setPairingTarget] = useState<WorkOrderDashboardItem | null>(null);

  const { rawUser } = useAuthStore();
  const branchId = rawUser?.active_branch_id || "";

  const isLeader = useMemo(() =>
    rawUser?.roles?.some((r: any) => {
      const roleName = (r?.name || r || "").toString().toLowerCase();
      return roleName.includes("leader");
    }),
    [rawUser?.roles]
  );

  const { data, isLoading, isError, refetch, isFetching } = useTeamLeaderDashboard({
    params: {
      date,
      ...(selectedState ? { state: selectedState } : {}),
      ...(selectedType ? { type: selectedType } : {}),
      ...(isLeader && branchId ? { branch_id: branchId } : {}),
    },
    queryConfig: { enabled: !!rawUser },
  });

  const { data: latestLocations, refetch: refetchMap } = useTechnicianLatestLocations(
    isLeader ? branchId : undefined,
    { 
      enabled: !!rawUser,
      refetchInterval: 60000
    }
  );

  if (isLoading || !rawUser) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="size-10 text-rose-500" />
        <p className="text-sm text-slate-600">{t("workOrder.teamPairing.failedToLoad")}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>{t("workOrder.noc.retry")}</Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t("workOrder.teamPairing.title")}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t("workOrder.teamPairing.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">{t("workOrder.types.allTypes")}</option>
            <option value="new_installation_broadband">{t("workOrder.types.newInstallBroadband")}</option>
            <option value="new_installation_enterprise">{t("workOrder.types.newInstallEnterprise")}</option>
            <option value="maintenance">{t("workOrder.types.maintenance")}</option>
            <option value="termination">{t("workOrder.types.termination")}</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="">{t("workOrder.states.allStatuses")}</option>
            <option value="created">{t(STATE_I18N_KEY.created)}</option>
            <option value="unassigned">{t(STATE_I18N_KEY.unassigned)}</option>
            <option value="assigned">{t(STATE_I18N_KEY.assigned)}</option>
            <option value="accepted">{t(STATE_I18N_KEY.accepted)}</option>
            <option value="dispatched">{t(STATE_I18N_KEY.dispatched)}</option>
            <option value="in_progress">{t(STATE_I18N_KEY.in_progress)}</option>
            <option value="paused">{t("workOrder.states.paused") || "Paused"}</option>
            <option value="pending_noc_verification">{t(STATE_I18N_KEY.pending_noc_verification)}</option>
            <option value="completed">{t(STATE_I18N_KEY.completed)}</option>
            <option value="rescheduled">{t(STATE_I18N_KEY.rescheduled)}</option>
            <option value="cancelled">{t(STATE_I18N_KEY.cancelled)}</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              refetchMap();
            }}
            disabled={isFetching}
            className="text-[10px] uppercase font-bold"
          >
            {isFetching ? <Loader2 className="size-3 animate-spin mr-1" /> : <RefreshCw className="size-3 mr-1" />}
            {t("workOrder.noc.refresh")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAutoAssign(true)}
            disabled={isLeader && !data?.auto_assign_enabled}
            className="text-[10px] uppercase font-bold"
          >
            <Zap className="size-3 mr-1" />
            {t("workOrder.detail.autoAssign")}
          </Button>
        </div>
      </div>

      {/* Daily Summary + Alerts */}
      <div className="mb-6">
        <TeamPairingSummary
          summary={data.daily_summary}
          alerts={data.alerts}
        />
      </div>

      {/* Live Map Integration */}
      <div className="mb-6 lg:mb-8">
        <TechnicianDispatchMap technicians={latestLocations ?? []} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* Left: Queue + Cross-Area */}
        <div className="col-span-12 lg:col-span-7 space-y-4 lg:space-y-6">
          <QueueList
            items={data.queue ?? []}
            selectedDate={date}
            onAssign={(wo) => setPairingTarget(wo)}
          />
          <CrossAreaPanel
            requests={data.cross_area_requests?.filter(
              (req) => req.created_at ? format(new Date(req.created_at), "yyyy-MM-dd") === date : false
            ) ?? []}
          />
        </div>

        {/* Right: Availability Board */}
        <div className="col-span-12 lg:col-span-5">
          <AvailabilityBoard technicians={data.availability_board ?? []} />
        </div>
      </div>

      {/* Modals */}
      {showAutoAssign && (
        <AutoAssignModal onClose={() => setShowAutoAssign(false)} />
      )}
      {pairingTarget && (
        <PairingModal
          workOrderId={pairingTarget.id}
          workOrderNumber={pairingTarget.number}
          currentTeam={pairingTarget.assigned_team ?? []}
          branchId={pairingTarget.branch_id}
          teamLeaderId={pairingTarget.queue_owner_id}
          onClose={() => setPairingTarget(null)}
        />
      )}
    </div>
  );
}
