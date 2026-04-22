export const PROFILE_GROUP_KEYS = {
  all: () => ["PROFILE_GROUP"],
  root: () => ["PROFILE_GROUP"],
  list: (args?: any) => ["PROFILE_GROUP", "LIST", { ...(args || {}) }],
  detail: (id: string | number) => ["PROFILE_GROUP", "DETAIL", id],
};
