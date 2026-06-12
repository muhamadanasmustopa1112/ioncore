"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { MenuConfig, MenuItem } from "@/config/types";
import { paths } from "@/config/paths";
import {
  buildPermissionSetFromNames,
  heldMatchesPermission,
  normalizePermissionName,
} from "@/lib/permission-aliases";

export type PermissionInput = string | string[] | undefined | null;

export interface PermissionCheckOptions {
  requireAll?: boolean;
}

const SUPER_ROLE_NAMES = ["super admin", "superadmin", "super_admin"];

export function getUserPermissionSet(): Set<string> {
  const raw = useAuthStore.getState().rawUser;
  const names = (raw?.permissions || [])
    .map((p) => (p?.name ? normalizePermissionName(p.name) : ""))
    .filter(Boolean);
  return buildPermissionSetFromNames(names);
}

export function isSuperAdminUser(): boolean {
  const raw = useAuthStore.getState().rawUser;
  const roles = raw?.roles || [];
  return roles.some((r) =>
    SUPER_ROLE_NAMES.includes(normalizePermissionName(r.name || "")),
  );
}

export function userHasPermission(
  permissionNames: Array<string | undefined | null>,
  required: PermissionInput,
  options: PermissionCheckOptions = {},
): boolean {
  const held = buildPermissionSetFromNames(
    permissionNames
      .filter((name): name is string => !!name)
      .map(normalizePermissionName),
  );
  return checkPermission(required, held, options);
}

export function checkPermission(
  required: PermissionInput,
  held: Set<string>,
  options: PermissionCheckOptions = {},
): boolean {
  if (!required) return true;
  const list = Array.isArray(required) ? required : [required];
  if (list.length === 0) return true;
  const needles = list.map(normalizePermissionName);
  if (options.requireAll) {
    return needles.every((n) => heldMatchesPermission(held, n));
  }
  return needles.some((n) => heldMatchesPermission(held, n));
}

// ── React hooks ────────────────────────────────────────
export function usePermissionSet(): Set<string> {
  const rawUser = useAuthStore((s) => s.rawUser);
  return useMemo(() => {
    const names = (rawUser?.permissions || [])
      .map((p) => (p?.name ? normalizePermissionName(p.name) : ""))
      .filter(Boolean);
    return buildPermissionSetFromNames(names);
  }, [rawUser?.permissions]);
}

export function useIsSuperAdmin(): boolean {
  const rawUser = useAuthStore((s) => s.rawUser);
  return useMemo(() => {
    const roles = rawUser?.roles || [];
    return roles.some((r) =>
      SUPER_ROLE_NAMES.includes(normalizePermissionName(r.name || "")),
    );
  }, [rawUser?.roles]);
}

/**
 * Returns true when the user is allowed.
 * - no permission required → true
 * - super admin → true
 * - user still loading → true (avoid UI flicker; middleware already gates routes)
 */
export function useCan(
  permission: PermissionInput,
  options: PermissionCheckOptions = {},
): boolean {
  const rawUser = useAuthStore((s) => s.rawUser);
  const held = usePermissionSet();
  const isSuper = useIsSuperAdmin();

  return useMemo(() => {
    if (!permission) return true;
    if (!rawUser) return true;
    if (isSuper) return true;
    return checkPermission(permission, held, options);
  }, [permission, rawUser, held, isSuper, options.requireAll]);
}

// ── Guard component ────────────────────────────────────
export interface CanProps {
  permission: PermissionInput;
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Can({ permission, requireAll, fallback = null, children }: CanProps) {
  const allowed = useCan(permission, { requireAll });
  return allowed ? <>{children}</> : <>{fallback}</>;
}

// ── Page guard ─────────────────────────────────────────
export interface PageGuardProps {
  permission: PermissionInput;
  requireAll?: boolean;
  /** Custom fallback UI. If omitted, a default 403 screen renders. */
  fallback?: ReactNode;
  /** If set, redirect to this path instead of rendering fallback. */
  redirectTo?: string;
  /** Shown while user profile still loading. */
  loadingFallback?: ReactNode;
  children: ReactNode;
}

function DefaultForbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="text-4xl font-bold">403</div>
      <div className="text-lg font-semibold">No access</div>
      <p className="text-muted-foreground text-sm max-w-md">
        You don&apos;t have permission to view this page. Contact your administrator if you think this is a mistake.
      </p>
    </div>
  );
}

export function PageGuard({
  permission,
  requireAll,
  fallback,
  redirectTo,
  loadingFallback = null,
  children,
}: PageGuardProps) {
  const router = useRouter();
  const rawUser = useAuthStore((s) => s.rawUser);
  const allowed = useCan(permission, { requireAll });

  useEffect(() => {
    if (rawUser && !allowed && redirectTo) {
      router.replace(redirectTo);
    }
  }, [rawUser, allowed, redirectTo, router]);

  if (!rawUser) return <>{loadingFallback}</>;
  if (allowed) return <>{children}</>;
  if (redirectTo) return null;
  return <>{fallback ?? <DefaultForbidden />}</>;
}

/** HOC variant for wrapping page components. */
export function withPageGuard<P extends object>(
  Component: React.ComponentType<P>,
  guard: Omit<PageGuardProps, "children">,
) {
  return function Guarded(props: P) {
    return (
      <PageGuard {...guard}>
        <Component {...props} />
      </PageGuard>
    );
  };
}

// ── Menu filter ────────────────────────────────────────
interface FilterContext {
  held: Set<string>;
  isSuper: boolean;
  loaded: boolean;
  roles?: string[];
}

function itemAllowed(item: MenuItem, ctx: FilterContext): boolean {
  if (!item.permission) return true;
  if (!ctx.loaded) return true;
  if (ctx.isSuper) return true;
  return checkPermission(item.permission, ctx.held, {
    requireAll: item.requireAll,
  });
}

function filterItems(items: MenuConfig, ctx: FilterContext): MenuConfig {
  const out: MenuConfig = [];
  for (const item of items) {
    if (!itemAllowed(item, ctx)) continue;

    if (item.children && item.children.length > 0) {
      const kids = filterItems(item.children, ctx);
      if (kids.length === 0 && !item.path) continue;
      out.push({ ...item, children: kids });
    } else {
      out.push(item);
    }
  }
  return out;
}

export function filterMenuByPermissions(
  menu: MenuConfig,
  ctx: FilterContext,
): MenuConfig {
  // Ensure consistent empty state while loading user state
  if (!ctx.loaded) return [];

  // Standard recursive permissions evaluation
  return filterItems(menu, ctx);
}

export function useFilteredMenu(menu: MenuConfig): MenuConfig {
  const rawUser = useAuthStore((s) => s.rawUser);
  const held = usePermissionSet();
  const isSuper = useIsSuperAdmin();

  const roles = useMemo(
    () => (rawUser?.roles || []).map((r) => r.name),
    [rawUser?.roles],
  );

  return useMemo(
    () =>
      filterMenuByPermissions(menu, {
        held,
        isSuper,
        loaded: !!rawUser,
        roles,
      }),
    [menu, held, isSuper, rawUser, roles],
  );
}
