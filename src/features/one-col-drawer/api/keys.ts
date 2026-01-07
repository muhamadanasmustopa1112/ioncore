export const EMPLOYEE_KEYS = {
  root: () => ["EMPLOYEE"],
  list: (args?: any) => [EMPLOYEE_KEYS.root(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [EMPLOYEE_KEYS.root(), "DETAIL", id],
  select: (search?: string) => [EMPLOYEE_KEYS.root(), "SELECT", search || ""],
};
