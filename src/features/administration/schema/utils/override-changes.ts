import type { OverrideChange } from "../store/schema";

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}

function formatValue(v: unknown): string {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ") || "—";
  if (typeof v === "object") {
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}

function toLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function computeOverrideChanges<T extends object>(
  snapshot: T,
  current: T,
  labelMap?: Record<string, string>,
): OverrideChange[] {
  const changes: OverrideChange[] = [];
  const keys = Array.from(new Set([...Object.keys(snapshot), ...Object.keys(current)]));
  for (const key of keys) {
    const prev = (snapshot as Record<string, unknown>)[key];
    const next = (current as Record<string, unknown>)[key];
    if (!isEqual(prev, next)) {
      changes.push({
        field: labelMap?.[key] ?? toLabel(key),
        prev: formatValue(prev),
        next: formatValue(next),
      });
    }
  }
  return changes;
}
