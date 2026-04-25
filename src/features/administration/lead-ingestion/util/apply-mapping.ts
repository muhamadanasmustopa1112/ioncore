import type { CreateLeadPayload } from "@/features/leads/types/leads-api";
import {
  ExternalSource,
  FieldMapping,
  MappableLeadField,
  REQUIRED_LEAD_FIELDS,
} from "../types/lead-ingestion";

type ApplyResult =
  | { ok: true; lead: CreateLeadPayload }
  | { ok: false; missing: MappableLeadField[] };

export function applyMapping(
  mapping: FieldMapping | undefined,
  source: ExternalSource,
  payload: Record<string, unknown>
): ApplyResult {
  const resolved: Partial<Record<MappableLeadField, string>> = {
    lead_type: source.defaultLeadType,
    customer_sub_type: source.defaultCustomerSubType,
    source: source.defaultSource,
    branch_id: source.defaultBranchId || "",
  };

  for (const row of mapping?.rows ?? []) {
    const raw = payload[row.externalField];
    const value = raw == null || raw === "" ? row.defaultValue : String(raw);
    if (value !== "") resolved[row.internalField] = value;
  }

  const missing = REQUIRED_LEAD_FIELDS.filter((f) => !resolved[f]);
  if (missing.length > 0) return { ok: false, missing };

  const lead: CreateLeadPayload = {
    lead_type: resolved.lead_type as CreateLeadPayload["lead_type"],
    customer_sub_type: resolved.customer_sub_type as CreateLeadPayload["customer_sub_type"],
    lead_name: resolved.lead_name as string,
    source: resolved.source as CreateLeadPayload["source"],
    branch_id: resolved.branch_id as string,
    referrer_customer_id: resolved.referrer_customer_id || null,
  };
  return { ok: true, lead };
}
