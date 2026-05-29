import type { CalendarParams } from "../types";

export const CALENDAR_KEYS = {
  all: () => ["CALENDAR"],
  root: () => ["CALENDAR"],
  list: (args?: CalendarParams) => [...CALENDAR_KEYS.all(), "LIST", ...(args ? [{ ...args }] : [])],
  detail: (id: string) => [...CALENDAR_KEYS.all(), "DETAIL", id],
  conflicts: (id: string) => [...CALENDAR_KEYS.all(), "CONFLICTS", id],
};
