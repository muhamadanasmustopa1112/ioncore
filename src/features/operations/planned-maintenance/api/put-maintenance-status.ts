import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MAINTENANCE_KEYS } from "./keys";
import { DUMMY_MAINTENANCE_EVENTS } from "../data/dummy-maintenance";
import type { UpdateMaintenanceStatusPayload, MaintenanceTimelineEntry } from "../types";

const updateMaintenanceStatus = async (payload: UpdateMaintenanceStatusPayload) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const event = DUMMY_MAINTENANCE_EVENTS.find((e) => e.id === payload.id);
  if (!event) {
    throw new Error("Maintenance event not found");
  }

  const now = new Date().toISOString();
  const statusLabel = payload.status.replace(/_/g, " ");

  const newTimelineEntry: MaintenanceTimelineEntry = {
    id: `TL-${Date.now()}`,
    entry_type: payload.status === "scheduled" ? "approval" : payload.status === "cancelled" ? "cancelled" : "update",
    entry_text: payload.notes
      ? `Status changed to ${statusLabel}. Notes: ${payload.notes}`
      : `Status changed to ${statusLabel}`,
    created_at: now,
    created_by: "Current User",
  };

  event.status = payload.status;
  event.timeline.push(newTimelineEntry);

  if (payload.status === "scheduled") {
    event.approved_by = "Current User";
    event.approved_at = now;
    event.approval_notes = payload.notes;
  }

  event.updated_at = now;
  return event;
};

export function useUpdateMaintenanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMaintenanceStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MAINTENANCE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      toast.success("Maintenance status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update maintenance status");
    },
  });
}
