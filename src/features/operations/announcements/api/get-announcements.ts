import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@/lib/react-query";

import { dummyAnnouncements } from "../data/dummy-announcements";
import type {
  Announcement,
  AnnouncementListParams,
  AnnouncementListResponse,
} from "../types";

import { ANNOUNCEMENT_KEYS } from "./keys";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAnnouncements = async (
  params: AnnouncementListParams
): Promise<AnnouncementListResponse> => {
  await delay(300);

  let filtered: Announcement[] = [...dummyAnnouncements];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((a) => a.title.toLowerCase().includes(q));
  }

  if (params.priority) {
    filtered = filtered.filter((a) => a.priority === params.priority);
  }

  if (params.inbox_filter && params.inbox_filter !== "all") {
    filtered = filtered.filter((a) => {
      const { acknowledged_count, pending_count } = a.acknowledgment_summary;
      switch (params.inbox_filter) {
        case "acknowledged":
          return acknowledged_count > 0 && pending_count === 0;
        case "pending":
          return pending_count > 0;
        case "unread":
          return a.read_receipt_summary.not_opened_count > 0;
        default:
          return true;
      }
    });
  }

  const totalData = filtered.length;
  const start = params.start ?? 0;
  const length = params.length ?? 10;
  const paged = filtered.slice(start, start + length);

  return {
    data: paged,
    metadata: {
      total_data: totalData,
      total_page: Math.ceil(totalData / length),
    },
  };
};

export const getAnnouncementsQueryOptions = (
  params: AnnouncementListParams
) => {
  return queryOptions({
    queryKey: ANNOUNCEMENT_KEYS.list(params as Record<string, unknown>),
    queryFn: () => getAnnouncements(params),
  });
};

type UseAnnouncementsOptions = {
  params: AnnouncementListParams;
  queryConfig?: QueryConfig<typeof getAnnouncementsQueryOptions>;
};

export const useAnnouncements = ({
  params,
  queryConfig,
}: UseAnnouncementsOptions) => {
  return useQuery({
    ...getAnnouncementsQueryOptions(params),
    ...queryConfig,
  });
};
