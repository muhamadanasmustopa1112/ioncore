import { api } from "@/lib/api-client";
import { services } from "@/config/constants";
import type { SendNotificationPayload } from "../types/notification";

export const sendNotification = (payload: SendNotificationPayload) =>
  api.post(`${services.notification}/notifications/send`, payload);
