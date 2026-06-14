export const BRANCH_CODE_LENGTH = 3;

export function generateBranchCodeBase(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  return firstWord.slice(0, BRANCH_CODE_LENGTH).toUpperCase();
}

export function isDuplicateBranchCode(
  code: string,
  existingCodes: Iterable<string>,
): boolean {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return false;

  const taken = new Set(
    [...existingCodes].map((existing) => existing.trim().toUpperCase()).filter(Boolean),
  );

  return taken.has(normalized);
}
