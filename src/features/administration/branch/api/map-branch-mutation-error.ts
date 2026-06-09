import i18n from "@/i18n";

function extractErrorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
  return data?.error || data?.message || (err as Error)?.message || "";
}

function isDuplicateBranchCodeError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("idx_branches_code") ||
    (normalized.includes("duplicate key") && normalized.includes("code")) ||
    (normalized.includes("23505") && normalized.includes("branches_code"))
  );
}

export function getBranchMutationErrorMessage(
  err: unknown,
  fallbackKey: string,
): string {
  const raw = extractErrorMessage(err);

  if (isDuplicateBranchCodeError(raw)) {
    return i18n.t("administration.branch.form.duplicateBranchCode");
  }

  if (raw) return raw;

  return i18n.t(fallbackKey);
}
