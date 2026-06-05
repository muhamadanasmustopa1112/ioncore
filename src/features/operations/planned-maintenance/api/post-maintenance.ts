import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@/lib/react-query";

import { DUMMY_MAINTENANCE_EVENTS } from "../data/dummy-maintenance";
import type { MaintenanceEvent, MaintenanceFormData } from "../types";

import { MAINTENANCE_KEYS } from "./keys";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createMaintenance = async (
  payload: MaintenanceFormData
): Promise<MaintenanceEvent> => {
  await delay(300);

  const newEvent: MaintenanceEvent = {
    id: `MAINT-${Date.now()}`,
    operational_event_id: `OE-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    maintenance_type: payload.maintenance_type,
    scheduled_start: payload.scheduled_start,
    scheduled_end: payload.scheduled_end,
    estimated_duration_hours: 0,
    service_impact: payload.service_impact,
    requires_service_suspension: payload.requires_service_suspension,
    estimated_customers_affected: 0,
    confirmed_customers_affected: [],
    status: "draft",
    affected_areas: [],
    impacted_nodes: [],
    timeline: [
      {
        id: `TL-${Date.now()}`,
        entry_type: "scheduled",
        entry_text: "Maintenance event created",
        created_at: new Date().toISOString(),
        created_by: "current_user",
      },
    ],
    linked_wos: [],
    notifications_sent: [],
    created_by: "current_user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  DUMMY_MAINTENANCE_EVENTS.unshift(newEvent);
  return newEvent;
};

type UseCreateMaintenanceOptions = {
  mutationConfig?: MutationConfig<typeof createMaintenance>;
};

export const useCreateMaintenance = ({
  mutationConfig,
}: UseCreateMaintenanceOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenance,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: MAINTENANCE_KEYS.all(),
      });
    },
    ...mutationConfig,
  });
};
