/**
 * Unified pagination helpers — tolerate different BE metadata shapes.
 *
 * Handles all observed envelopes:
 * - { total, per_page, page }       (branch / sales / order)
 * - { total, size, page }           (customer service)
 * - { total_pages, total_records }  (audit-log)
 * - { count, limit }                (legacy)
 * - { total_count, page_size }      (rare)
 * - { totalPages } / { pageCount }  (camelCase variants)
 */

const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

export function getTotal(meta: unknown): number {
  if (!meta || typeof meta !== "object") return 0;
  const m = meta as Record<string, unknown>;
  return (
    num(m.total) ??
    num(m.total_records) ??
    num(m.total_count) ??
    num(m.totalCount) ??
    num(m.count) ??
    0
  );
}

export function getPerPage(meta: unknown, fallback: number): number {
  if (!meta || typeof meta !== "object") return fallback;
  const m = meta as Record<string, unknown>;
  return (
    num(m.per_page) ??
    num(m.size) ??
    num(m.limit) ??
    num(m.page_size) ??
    num(m.pageSize) ??
    fallback
  );
}

export function getPageCount(meta: unknown, fallbackLimit: number): number {
  if (!meta || typeof meta !== "object") return 0;
  const m = meta as Record<string, unknown>;
  const explicit = num(m.total_pages) ?? num(m.total_page) ?? num(m.totalPages) ?? num(m.pageCount);
  if (explicit !== undefined) return explicit;

  const total = getTotal(m);
  const limit = getPerPage(m, fallbackLimit);
  if (!limit || total <= 0) return 0;
  return Math.ceil(total / limit);
}
