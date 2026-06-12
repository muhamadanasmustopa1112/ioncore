import { useMemo } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { PERMISSIONS } from "@/config/permissions";
import { listUsers } from "@/features/user-service/api/users";
import { userServiceKeys } from "@/features/user-service/api/keys";
import type { AuthUser } from "@/features/user-service/types";
import { userHasPermission } from "@/lib/permissions";
import { sendNotification } from "@/features/administration/notification/api/send-notification";
import { getLeadMutationErrorMessage } from "./map-lead-mutation-error";
import { listSales } from "./sales-api";
import { buildSalesLeadDetailDeeplink } from "../utils/sales-deeplink";
import type { SalesListParams } from "./sales-api";
import type {
  CreateLeadActivityPayload,
  CreateLeadPayload,
  LeadDto,
  LeadListParams,
  RerouteLeadPayload,
  SalesEnvelope,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from "../types/leads-api";

const SALES_ADMIN_BRANCH_FETCH_SIZE = 100;

export const salesKeys = {
  all: ["sales"] as const,
  list: (params: SalesListParams) => [...salesKeys.all, "list", params] as const,
};

function userBelongsToBranch(user: AuthUser, branchId: string): boolean {
  if (user.branches?.some((branch) => branch.id === branchId)) return true;
  return user.home_branch_id === branchId || user.active_branch_id === branchId;
}

export function useSalesAdminUsers(branchId?: string) {
  const params = { per_page: 200, branch_id: branchId };
  const { data, isLoading, isError } = useQuery({
    queryKey: userServiceKeys.users(params),
    queryFn: () => listUsers(params),
    enabled: !!branchId,
  });

  const users = useMemo(
    () => {
      if (!branchId) return [];
      return (data?.data ?? []).filter(
        (user: AuthUser) =>
          user.is_active !== false &&
          userHasPermission(
            (user.permissions ?? []).map((permission) => permission.name),
            PERMISSIONS.lead.read,
          ) &&
          userBelongsToBranch(user, branchId),
      );
    },
    [branchId, data?.data],
  );

  return { users, isLoading: !!branchId && isLoading, isError };
}

export function useSalesList(params: SalesListParams = {}) {
  return useQuery({
    queryKey: salesKeys.list(params),
    queryFn: async () => {
      try {
        return (await listSales({ ...params, per_page: 100 })).data?.saleses ?? [];
      } catch {
        return [];
      }
    },
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
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

export function useAdminLeads(params: LeadListParams = {}, enabled = true) {
  return useQuery({
    queryKey: leadKeys.list(params),
    queryFn: async () => (await listLeadsAdmin(params)).data,
    placeholderData: (prev) => prev,
    enabled,
  });
}

export function useAdminLeadsByBranches(
  branchIds: string[],
  params: LeadListParams = {},
  enabled = true,
) {
  const fetchParams: LeadListParams = {
    ...params,
    page: 1,
    per_page: SALES_ADMIN_BRANCH_FETCH_SIZE,
  };

  const queries = useQueries({
    queries: branchIds.map((branch_id) => ({
      queryKey: leadKeys.list({ ...fetchParams, branch_id }),
      queryFn: async () => (await listLeadsAdmin({ ...fetchParams, branch_id })).data,
      enabled: enabled && branchIds.length > 0,
      placeholderData: (prev: Awaited<ReturnType<typeof listLeadsAdmin>>["data"]) => prev,
    })),
  });

  return useMemo(() => {
    const isLoading = enabled && (branchIds.length === 0 || queries.some((q) => q.isLoading));
    const byId = new Map<string, LeadDto>();

    for (const query of queries) {
      for (const lead of query.data?.leads ?? []) {
        byId.set(lead.id, lead);
      }
    }

    const allLeads = Array.from(byId.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const page = params.page ?? 1;
    const perPage = params.per_page ?? 25;
    const start = (page - 1) * perPage;

    return {
      data: {
        leads: allLeads.slice(start, start + perPage),
        metadata: {
          page,
          per_page: perPage,
          total: allLeads.length,
        },
      },
      isLoading,
    };
  }, [branchIds.length, enabled, params.page, params.per_page, queries]);
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
  return useMutation<SalesEnvelope<LeadDto>, unknown, CreateLeadPayload>({
    mutationFn: (payload) => createLead(payload),
    onSuccess: async (response, payload) => {
      toast.success("Lead created");
      qc.invalidateQueries({ queryKey: leadKeys.all });

      const lead = response.data;
      const assignedSalesId = payload.assigned_sales_id;
      if (!assignedSalesId || !lead?.id) return;

      try {
        await sendNotification({
          title: "Lead Baru Ditugaskan",
          body: `Lead "${lead.lead_name}" telah ditugaskan kepada Anda.`,
          user_id: assignedSalesId,
          is_send_push_notif: true,
          data: {
            deeplink: buildSalesLeadDetailDeeplink(lead.id),
          },
        });
      } catch {
        // Best-effort: lead is already created.
      }
    },
    onError: (err: unknown) => {
      toast.error(getLeadMutationErrorMessage(err, "leads.createFailed"));
    },
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
