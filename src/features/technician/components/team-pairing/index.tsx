"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeamLeaderDashboard } from "../../api/team-leader";
import { AutoAssignModal } from "../technician-detail/modals";
import { PairingModal } from "../technician-detail/modals";
import type { WorkOrderDashboardItem } from "../../types/technician-api";
import { TeamPairingSummary } from "./summary";
import { QueueList } from "./queue-list";
import { AvailabilityBoard } from "./availability-board";
import { CrossAreaPanel } from "./cross-area-panel";

export function TeamPairingDashboard() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showAutoAssign, setShowAutoAssign] = useState(false);
  const [pairingTarget, setPairingTarget] = useState<WorkOrderDashboardItem | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useTeamLeaderDashboard({ params: { date } });

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="size-10 text-rose-500" />
        <p className="text-sm text-slate-600">Failed to load team pairing dashboard.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
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
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm py-2 px-3"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
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
          alerts={data.alerts?.filter(
            (alert) => alert.created_at ? format(new Date(alert.created_at), "yyyy-MM-dd") === date : false
          )}
        />
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
