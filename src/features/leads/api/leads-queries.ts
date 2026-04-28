import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createLead,
  createLeadActivity,
  getLead,
  getLeadTimeline,
  listLeadsAdmin,
  listMyLeads,
  rerouteLead,
  updateLeadActivity,
  updateLeadAdmin,
  updateLeadCableAcceptance,
  updateLeadCableDistance,
  updateLeadStatus,
} from "./leads-api";
import { listSales } from "./sales-api";
import type { SalesListParams } from "./sales-api";
import type {
  CreateLeadActivityPayload,
  CreateLeadPayload,
  LeadListParams,
  RerouteLeadPayload,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from "../types/leads-api";

export const salesKeys = {
  all: ["sales"] as const,
  list: (params: SalesListParams) => [...salesKeys.all, "list", params] as const,
};

export function useSalesList(params: SalesListParams = {}) {
  return useQuery({
    queryKey: salesKeys.list(params),
    queryFn: async () => (await listSales({ ...params, per_page: 100 })).data?.saleses ?? [],
    placeholderData: [],
  });
}

export const leadKeys = {
  all: ["leads"] as const,
  list: (params: LeadListParams) => [...leadKeys.all, "list", params] as const,
  myList: (page: number, per_page: number) =>
    [...leadKeys.all, "my", page, per_page] as const,
  detail: (id: string) => [...leadKeys.all, "detail", id] as const,
  timeline: (id: string) => [...leadKeys.all, "timeline", id] as const,
};

export function useMyLeads(page = 1, per_page = 25) {
  return useQuery({
    queryKey: leadKeys.myList(page, per_page),
    queryFn: async () => (await listMyLeads({ page, per_page })).data,
  });
}

export function useAdminLeads(params: LeadListParams = {}) {
  return useQuery({
    queryKey: leadKeys.list(params),
    queryFn: async () => (await listLeadsAdmin(params)).data,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: async () => (await getLead(id)).data,
    enabled: !!id,
  });
}

export function useLeadTimeline(id: string) {
  return useQuery({
    queryKey: leadKeys.timeline(id),
    queryFn: async () => (await getLeadTimeline(id)).data,
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: () => {
      toast.success("Lead created");
      qc.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: () => toast.error("Failed to create lead"),
  });
}

export function useUpdateLeadStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeadStatusPayload) => updateLeadStatus(id, payload),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
      qc.invalidateQueries({ queryKey: leadKeys.timeline(id) });
    },
    onError: () => toast.error("Failed to update status"),
  });
}

export function useUpdateLeadCableDistance(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (meters: number) => updateLeadCableDistance(id, meters),
    onSuccess: () => {
      toast.success("Cable distance updated");
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
    },
    onError: () => toast.error("Failed to update cable distance"),
  });
}

export function useUpdateLeadCableAcceptance(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accepted: boolean) => updateLeadCableAcceptance(id, accepted),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
    },
    onError: () => toast.error("Failed to update cable acceptance"),
  });
}

export function useCreateLeadActivity(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadActivityPayload) => createLeadActivity(id, payload),
    onSuccess: () => {
      toast.success("Activity added");
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
    },
    onError: () => toast.error("Failed to add activity"),
  });
}

export function useUpdateLeadActivity(leadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      activityId,
      payload,
    }: {
      activityId: string;
      payload: CreateLeadActivityPayload;
    }) => updateLeadActivity(leadId, activityId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: leadKeys.detail(leadId) }),
    onError: () => toast.error("Failed to update activity"),
  });
}

export function useUpdateLeadAdmin(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => updateLeadAdmin(id, payload),
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: () => toast.error("Failed to update lead"),
  });
}

export function useRerouteLead(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RerouteLeadPayload) => rerouteLead(id, payload),
    onSuccess: () => {
      toast.success("Lead rerouted");
      qc.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: () => toast.error("Failed to reroute lead"),
  });
}
