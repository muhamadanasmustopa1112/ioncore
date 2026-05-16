"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OverrideDiffCtx {
  enabled: boolean;
  originalValues: Record<string, unknown>;
  currentValues: Record<string, unknown>;
}

const Ctx = createContext<OverrideDiffCtx | null>(null);

export function OverrideDiffProvider({
  enabled,
  originalValues,
  currentValues,
  children,
}: {
  enabled: boolean;
  originalValues: Record<string, unknown>;
  currentValues: Record<string, unknown>;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ enabled, originalValues, currentValues }),
    [enabled, originalValues, currentValues],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return a === b;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function formatPrev(v: unknown): string {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") {
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
}

export function useFieldDiff(name: string): { changed: boolean; previous: unknown } {
  const ctx = useContext(Ctx);
  if (!ctx?.enabled) return { changed: false, previous: undefined };
  const prev = getByPath(ctx.originalValues, name);
  const curr = getByPath(ctx.currentValues, name);
  return { changed: !isEqual(curr, prev), previous: prev };
}

export function DiffWrap({
  name,
  children,
  className,
}: {
  name: string;
  children: ReactNode;
  className?: string;
}) {
  const { changed, previous } = useFieldDiff(name);
  const ctx = useContext(Ctx);
  const enabled = ctx?.enabled ?? false;

  return (
    <div className={cn("relative", className)}>
      {children}
      {enabled && changed && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Previously: <span className="font-mono line-through opacity-70">{formatPrev(previous)}</span>
        </p>
      )}
    </div>
  );
}
