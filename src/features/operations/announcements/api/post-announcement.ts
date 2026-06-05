import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@/lib/react-query";

import { dummyAnnouncements } from "../data/dummy-announcements";
import type { Announcement, AnnouncementFormData } from "../types";

import { ANNOUNCEMENT_KEYS } from "./keys";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createAnnouncement = async (
  payload: AnnouncementFormData
): Promise<Announcement> => {
  await delay(300);

  const now = new Date().toISOString();
  const newAnnouncement: Announcement = {
    id: `ann-${Date.now()}`,
    title: payload.title,
    body: payload.body,
    priority: payload.priority,
    target_roles: payload.target_roles,
    target_branches: payload.target_branches,
    channels: payload.channels,
    created_at: now,
    expires_at: payload.expires_at,
    acknowledgment_summary: {
      total_recipients: 0,
      acknowledged_count: 0,
      pending_count: 0,
      pending_users: [],
    },
    read_receipt_summary: {
      opened_count: 0,
      not_opened_count: 0,
    },
  };

  dummyAnnouncements.unshift(newAnnouncement);
  return newAnnouncement;
};

type UseCreateAnnouncementOptions = {
  mutationConfig?: MutationConfig<typeof createAnnouncement>;
};

export const useCreateAnnouncement = ({
  mutationConfig,
}: UseCreateAnnouncementOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.all(),
      });
    },
    ...mutationConfig,
  });
};
