export const PROFILE_KEYS = {
  root: () => ["PROFILE"],
  list: (args?: Record<string, string>) => [
    PROFILE_KEYS.root(),
    "LIST",
    { ...(args || {}) },
  ],
  detail: (id: string) => [PROFILE_KEYS.root(), "DETAIL", id],
};
