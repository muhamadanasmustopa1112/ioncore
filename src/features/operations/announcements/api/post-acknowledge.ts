import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@/lib/react-query";

import { dummyRecipients, dummyAnnouncements } from "../data/dummy-announcements";

import { ANNOUNCEMENT_KEYS } from "./keys";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const acknowledgeAnnouncement = async (
  id: string
): Promise<{ success: boolean }> => {
  await delay(300);

  const recipient = dummyRecipients.find((r) => r.id === id);
  if (!recipient) {
    throw new Error("Recipient not found");
  }

  if (!recipient.acknowledged) {
    recipient.acknowledged = true;
    recipient.acknowledged_at = new Date().toISOString();
  }

  const announcement = dummyAnnouncements.find((a) =>
    a.acknowledgment_summary.pending_users.includes(recipient.user_name)
  );

  if (announcement) {
    const summary = announcement.acknowledgment_summary;
    summary.acknowledged_count += 1;
    summary.pending_count = Math.max(0, summary.pending_count - 1);
    summary.pending_users = summary.pending_users.filter(
      (u) => u !== recipient.user_name
    );
  }

  return { success: true };
};

type UseAcknowledgeAnnouncementOptions = {
  mutationConfig?: MutationConfig<typeof acknowledgeAnnouncement>;
};

export const useAcknowledgeAnnouncement = ({
  mutationConfig,
}: UseAcknowledgeAnnouncementOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acknowledgeAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ANNOUNCEMENT_KEYS.all(),
      });
    },
    ...mutationConfig,
  });
};
