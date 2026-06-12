/**
 * Expands a canonical dot-notation permission into all accepted name variants.
 * Backend records may use underscores (crm_read) while the frontend uses dots (crm.read).
 */
export function normalizePermissionName(name: string): string {
  return name.trim().toLowerCase();
}

export function permissionVariants(name: string): string[] {
  const normalized = normalizePermissionName(name);
  const underscore = normalized.replace(/\./g, "_");
  if (underscore === normalized) {
    return [normalized];
  }
  return [normalized, underscore];
}

export function heldMatchesPermission(held: Set<string>, permission: string): boolean {
  return permissionVariants(permission).some((variant) => held.has(variant));
}

export function buildPermissionSetFromNames(names: string[]): Set<string> {
  return new Set(names.map(normalizePermissionName).filter(Boolean));
}
