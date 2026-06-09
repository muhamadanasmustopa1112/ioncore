import i18n from "@/i18n";

function extractErrorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
  return data?.error || data?.message || (err as Error)?.message || "";
}

function isNoSalesRepAvailableError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("sales rep") &&
    (normalized.includes("available") ||
      normalized.includes("tersedia") ||
      normalized.includes("tidak ada"))
  );
}

export function getLeadMutationErrorMessage(err: unknown, fallbackKey: string): string {
  const raw = extractErrorMessage(err);

  if (isNoSalesRepAvailableError(raw)) {
    return i18n.t("leads.noSalesRepAvailable");
  }

  if (raw) {
    return raw.replace(/^bad request:\s*/i, "").trim() || raw;
  }

  return i18n.t(fallbackKey);
}
