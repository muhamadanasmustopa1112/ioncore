import type { TFunction } from "i18next";
import { RBAC_PERMISSION_SEED } from "@/config/rbac-permission-seed";

export type PermissionUiCategory = "menu" | "query" | "action" | "system";

export interface PermissionLike {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}

export interface PermissionDisplay {
  title: string;
  subtitle: string;
  category: PermissionUiCategory;
  categoryLabel: string;
  scopeHint?: string;
  technicalName: string;
  searchText: string;
}

const SEED_DESCRIPTIONS = new Map(
  RBAC_PERMISSION_SEED.map((entry) => [`${entry.resource}.${entry.action}`, entry.description]),
);

/** Top-level module opens in sidebar — `read` is menu access, not row-level query. */
const MENU_MODULE_RESOURCES = new Set([
  "dashboard",
  "crm",
  "network",
  "technician",
  "warehouse",
  "billing",
  "ops",
  "cs",
  "enterprise",
  "warroom",
]);

const SYSTEM_RESOURCES = new Set([
  "access",
  "auth",
  "audit",
  "permission",
  "role",
  "user",
  "master",
  "schema",
  "budget",
  "quota",
]);

const CATEGORY_ORDER: PermissionUiCategory[] = ["menu", "query", "action", "system"];

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function humanizeToken(value: string): string {
  return value
    .split(/[._]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPermissionCategory(resource?: string, action?: string): PermissionUiCategory {
  const r = normalize(resource);
  const a = normalize(action);

  if (SYSTEM_RESOURCES.has(r)) return "system";
  if (a === "read" && MENU_MODULE_RESOURCES.has(r)) return "menu";
  if (a === "read" || a === "read_all" || a.includes("read")) return "query";
  return "action";
}

function getScopeHint(action: string | undefined, t: TFunction): string | undefined {
  const a = normalize(action);
  if (a === "read_all") return t("permissions.scopes.all");
  if (a === "read" || a.endsWith(".read")) return t("permissions.scopes.own");
  return undefined;
}

function getResourceLabel(resource: string, t: TFunction): string {
  const key = `permissions.resources.${resource}`;
  const translated = t(key, { defaultValue: "" });
  if (translated && translated !== key) return translated;
  return humanizeToken(resource);
}

function getActionLabel(action: string, t: TFunction): string {
  const exactKey = `permissions.actions.${action}`;
  const exact = t(exactKey, { defaultValue: "" });
  if (exact && exact !== exactKey) return exact;

  if (action.includes(".")) {
    const [segment, verb] = action.split(".");
    const segmentLabel = t(`permissions.segments.${segment}`, {
      defaultValue: humanizeToken(segment),
    });
    const verbLabel = t(`permissions.actions.${verb}`, {
      defaultValue: humanizeToken(verb),
    });
    return `${segmentLabel} — ${verbLabel}`;
  }

  return t(`permissions.actions.${action}`, { defaultValue: humanizeToken(action) });
}

function buildComposedTitle(resource: string, action: string, t: TFunction): string {
  const resourceLabel = getResourceLabel(resource, t);
  const actionLabel = getActionLabel(action, t);
  const category = getPermissionCategory(resource, action);
  const scopeHint = getScopeHint(action, t);

  if (category === "menu") {
    return t("permissions.templates.openModule", {
      module: resourceLabel,
      defaultValue: `Open ${resourceLabel} module`,
    });
  }

  if (category === "query" && scopeHint) {
    return t("permissions.templates.viewData", {
      module: resourceLabel,
      scope: scopeHint,
      defaultValue: `View ${resourceLabel} (${scopeHint})`,
    });
  }

  return t("permissions.templates.moduleAction", {
    module: resourceLabel,
    action: actionLabel,
    defaultValue: `${resourceLabel} — ${actionLabel}`,
  });
}

export function resolvePermissionDisplay(
  perm: PermissionLike,
  t: TFunction,
): PermissionDisplay {
  const resource = perm.resource ?? perm.name?.split(".")[0] ?? "";
  const action = perm.action ?? perm.name?.split(".").slice(1).join(".") ?? "";
  const technicalName = perm.name ?? `${resource}.${action}`;
  const seedKey = `${resource}.${action}`;
  const category = getPermissionCategory(resource, action);
  const scopeHint = getScopeHint(action, t);

  const seedDescription = SEED_DESCRIPTIONS.get(seedKey);
  const i18nKey = `permissions.entries.${seedKey}`;
  const i18nTitle = t(i18nKey, { defaultValue: "" });
  const title =
    (i18nTitle && i18nTitle !== i18nKey
      ? i18nTitle
      : seedDescription) || buildComposedTitle(resource, action, t);

  const subtitle = perm.description?.trim() || technicalName;

  return {
    title,
    subtitle: technicalName,
    category,
    categoryLabel: t(`permissions.categories.${category}`),
    scopeHint,
    technicalName,
    searchText: [
      title,
      subtitle,
      technicalName,
      resource,
      action,
      perm.description,
      scopeHint,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

export interface PermissionGroup {
  category: PermissionUiCategory;
  label: string;
  items: Array<PermissionLike & { id: string }>;
}

export function groupPermissions<T extends PermissionLike & { id: string }>(
  permissions: T[],
  t: TFunction,
): PermissionGroup[] {
  const buckets = new Map<PermissionUiCategory, T[]>();

  for (const perm of permissions) {
    const category = getPermissionCategory(perm.resource, perm.action);
    const list = buckets.get(category) ?? [];
    list.push(perm);
    buckets.set(category, list);
  }

  return CATEGORY_ORDER.filter((category) => buckets.has(category)).map((category) => {
    const items = [...(buckets.get(category) ?? [])].sort((a, b) => {
      const aDisplay = resolvePermissionDisplay(a, t);
      const bDisplay = resolvePermissionDisplay(b, t);
      return aDisplay.title.localeCompare(bDisplay.title);
    });

    return {
      category,
      label: t(`permissions.categories.${category}`),
      items,
    };
  });
}

export function permissionMatchesSearch(perm: PermissionLike, query: string, t: TFunction): boolean {
  if (!query.trim()) return true;
  const display = resolvePermissionDisplay(perm, t);
  return display.searchText.includes(query.trim().toLowerCase());
}
