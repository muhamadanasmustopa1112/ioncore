export const CSAT_KEYS = {
  all: () => ["CSAT"],
  root: () => ["CSAT"],
  summary: () => [...CSAT_KEYS.all(), "SUMMARY"],
};
