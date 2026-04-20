export const PROFILE_GROUP_KEYS = {
  root: () => ["PROFILE_GROUP"],
  list: (args?: any) => [PROFILE_GROUP_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [PROFILE_GROUP_KEYS.root(), "DETAIL", id],
};
