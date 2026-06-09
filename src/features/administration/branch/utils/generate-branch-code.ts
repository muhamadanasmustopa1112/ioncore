export const BRANCH_CODE_LENGTH = 3;

export function generateBranchCodeBase(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] ?? "";
  return firstWord.slice(0, BRANCH_CODE_LENGTH).toUpperCase();
}

function toBranchCode(value: string): string | null {
  const normalized = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return normalized.length === BRANCH_CODE_LENGTH ? normalized : null;
}

function buildNameCandidates(name: string): string[] {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const candidates: string[] = [];
  const add = (raw: string) => {
    const code = toBranchCode(raw);
    if (code && !candidates.includes(code)) candidates.push(code);
  };

  const [first, second, third] = words;

  add(first.slice(0, BRANCH_CODE_LENGTH));
  add(words.slice(0, BRANCH_CODE_LENGTH).map((word) => word[0] ?? "").join(""));

  if (second) {
    add(first.slice(0, 2) + (second[0] ?? ""));
    add((first[0] ?? "") + second.slice(0, 2));
  }

  if (second && third) {
    add((first[0] ?? "") + (second[0] ?? "") + (third[0] ?? ""));
  }

  return candidates;
}

function buildFallbackCandidates(basePrefix: string, taken: Set<string>): string[] {
  const prefix = basePrefix.slice(0, 2).padEnd(2, "X").toUpperCase();
  const fallbacks: string[] = [];

  for (let digit = 2; digit <= 9; digit += 1) {
    const code = `${prefix}${digit}`;
    if (!taken.has(code) && !fallbacks.includes(code)) fallbacks.push(code);
  }

  for (let i = 0; i < 26; i += 1) {
    const code = `${prefix}${String.fromCharCode(65 + i)}`;
    if (!taken.has(code) && !fallbacks.includes(code)) fallbacks.push(code);
  }

  if (basePrefix.length >= 2) {
    const suffix = basePrefix.slice(1, BRANCH_CODE_LENGTH).toUpperCase();
    for (let i = 0; i < 26; i += 1) {
      const code = `${String.fromCharCode(65 + i)}${suffix}`;
      if (!taken.has(code) && !fallbacks.includes(code)) fallbacks.push(code);
    }
  }

  return fallbacks;
}

export function generateUniqueBranchCode(
  name: string,
  existingCodes: Iterable<string>,
): string {
  const taken = new Set(
    [...existingCodes].map((code) => code.trim().toUpperCase()).filter(Boolean),
  );

  for (const candidate of buildNameCandidates(name)) {
    if (!taken.has(candidate)) return candidate;
  }

  const base = generateBranchCodeBase(name);
  const fallbacks = buildFallbackCandidates(base || "XX", taken);
  if (fallbacks.length > 0) return fallbacks[0];

  return base.slice(0, BRANCH_CODE_LENGTH).padEnd(BRANCH_CODE_LENGTH, "X");
}
