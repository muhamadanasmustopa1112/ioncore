"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle, RefreshCw, Zap } from "lucide-react";

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

const TechnicianDispatchMap = dynamic<{ technicians?: TechnicianLatestLocation[] }>(() => import("./tech-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] sm:h-[380px] w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        <Loader2 className="size-5 animate-spin" />
        Initializing Map Engine
      </div>
    </div>
  ),
});

export function TeamPairingDashboard() {
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
    { enabled: !!rawUser }
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
        <p className="text-sm text-slate-600">Failed to load team pairing dashboard.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
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
          <h1 className="text-2xl font-bold text-on-surface">Team Pairing</h1>
          <p className="text-sm text-slate-500 mt-0.5">Assign technician pairs to work orders</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Types</option>
            <option value="new_installation_broadband">Broadband Install</option>
            <option value="new_installation_enterprise">Enterprise Install</option>
            <option value="maintenance">Maintenance</option>
            <option value="termination">Termination</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3 text-slate-700 dark:text-slate-200"
          >
            <option value="">All States</option>
            <option value="created">Created</option>
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="dispatched">Dispatched</option>
            <option value="in_progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="pending_noc_verification">Pending NOC Verify</option>
            <option value="completed">Completed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="cancelled">Cancelled</option>
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
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAutoAssign(true)}
            disabled={isLeader && !data?.auto_assign_enabled}
            className="text-[10px] uppercase font-bold"
          >
            <Zap className="size-3 mr-1" />
            Auto-Assign
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
