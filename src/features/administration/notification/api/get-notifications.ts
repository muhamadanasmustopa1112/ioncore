import { useQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { NotificationParams, NotificationResponse } from "../types/notification";

export const getNotifications = (params: NotificationParams): Promise<NotificationResponse> => {
  return api.get(`${services.notification}/notifications`, { params });
};

export const useNotifications = (params: NotificationParams = { page: 1, per_page: 20 }) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    refetchInterval: 30000,
  });
};
