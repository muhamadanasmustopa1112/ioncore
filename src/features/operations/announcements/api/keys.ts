export const ANNOUNCEMENT_KEYS = {
  all: () => ["ANNOUNCEMENTS"] as const,
  list: (params?: Record<string, unknown>) =>
    [...ANNOUNCEMENT_KEYS.all(), "LIST", params] as const,
};
