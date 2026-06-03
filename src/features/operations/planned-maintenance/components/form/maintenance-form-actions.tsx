"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMaintenanceStore } from "../../store/maintenance";
import { useUpdateMaintenanceStatus } from "../../api/put-maintenance-status";
import type { MaintenanceStatus } from "../../types";

const STATUS_VARIANT: Record<MaintenanceStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  draft: "secondary",
  scheduled: "primary",
  approved: "primary",
  in_progress: "warning",
  completed: "success",
  cancelled: "destructive",
  escalated_to_war_room: "destructive",
};

export function MaintenanceFormActions() {
  const { closeFormSheet, selectedMaintenance } = useMaintenanceStore();
  const { mutate: updateStatus, isPending } = useUpdateMaintenanceStatus();
  const [notes, setNotes] = useState("");
  const data = selectedMaintenance;
  if (!data) return null;

  const onSuccess = () => { closeFormSheet(); };

  const handleStatus = (status: MaintenanceStatus) => {
    updateStatus({ id: data.id, status, notes: notes || undefined }, { onSuccess });
  };

  const status = data.status;
  const isDraft = status === "draft";
  const isScheduled = status === "scheduled";
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isCancelled = status === "cancelled";
  const isEscalated = status === "escalated_to_war_room";
  const isTerminal = isCompleted || isCancelled || isEscalated;

  return (
    <div className="flex flex-col h-full overflow-hidden p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Maintenance Summary</h3>
          <Badge variant={STATUS_VARIANT[status]}>{status.replace(/_/g, " ")}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Title</span>
            <p className="font-medium">{data.title}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Type</span>
            <p className="font-medium">{data.maintenance_type.replace(/_/g, " ")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Scheduled Start</span>
            <p className="font-medium">{new Date(data.scheduled_start).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Scheduled End</span>
            <p className="font-medium">{new Date(data.scheduled_end).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Service Impact</span>
            <p className="font-medium">{data.service_impact.replace(/_/g, " ")}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Customers Affected</span>
            <p className="font-medium">{data.estimated_customers_affected}</p>
          </div>
        </div>

        {data.affected_areas.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Affected Areas</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.affected_areas.map((area) => (
                <Badge key={area.area_id} variant="outline">
                  {area.area_name} — {area.sub_area_names.join(", ")}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.impacted_nodes.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Impacted Nodes</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.impacted_nodes.map((node) => (
                <Badge key={node.node_id} variant="outline">
                  {node.node_name} ({node.impact_role})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!isTerminal && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Enter notes..."
              className="min-h-[100px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        {isTerminal && data.outcome_notes && (
          <div className="text-sm">
            <span className="text-muted-foreground">Outcome Notes</span>
            <p className="font-medium mt-1">{data.outcome_notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        {isDraft && (
          <>
            <Button variant="primary" onClick={() => handleStatus("scheduled")} disabled={isPending} className="font-semibold">
              {isPending ? "Approving..." : "Approve"}
            </Button>
            <Button variant="destructive" onClick={() => handleStatus("cancelled")} disabled={isPending} className="font-semibold">
              {isPending ? "Rejecting..." : "Reject"}
            </Button>
          </>
        )}
        {isScheduled && (
          <Button variant="primary" onClick={() => handleStatus("in_progress")} disabled={isPending} className="font-semibold">
            {isPending ? "Starting..." : "Start Maintenance"}
          </Button>
        )}
        {isInProgress && (
          <>
            <Button variant="primary" onClick={() => handleStatus("completed")} disabled={isPending} className="font-semibold">
              {isPending ? "Completing..." : "Complete"}
            </Button>
            <Button variant="destructive" onClick={() => handleStatus("escalated_to_war_room")} disabled={isPending} className="font-semibold">
              {isPending ? "Escalating..." : "Escalate to War Room"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
