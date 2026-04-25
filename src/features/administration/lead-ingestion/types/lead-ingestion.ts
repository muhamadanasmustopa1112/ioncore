import type {
  CustomerSubType,
  LeadSource,
  LeadType,
} from "@/features/leads/types/leads-api";

export type SourceFormMode = "new" | "edit" | "details" | null;

export type SourceType =
  | "web_form"
  | "partner_api"
  | "marketplace"
  | "affiliate"
  | "csv_upload";

export type SourceStatus = "active" | "inactive";

export interface ExternalSource {
  id: string;
  name: string;
  type: SourceType;
  apiKey: string;
  webhookUrl: string;
  defaultBranchId: string;
  defaultLeadType: LeadType;
  defaultCustomerSubType: CustomerSubType;
  defaultSource: LeadSource;
  status: SourceStatus;
  createdAt: string;
  updatedAt: string;
}

export type MappableLeadField =
  | "lead_name"
  | "lead_type"
  | "customer_sub_type"
  | "source"
  | "branch_id"
  | "referrer_customer_id";

export interface MappingRow {
  id: string;
  externalField: string;
  internalField: MappableLeadField;
  defaultValue: string;
}

export interface FieldMapping {
  sourceId: string;
  rows: MappingRow[];
}

export const REQUIRED_LEAD_FIELDS: MappableLeadField[] = [
  "lead_type",
  "customer_sub_type",
  "lead_name",
  "source",
  "branch_id",
];

export const MAPPABLE_FIELDS: MappableLeadField[] = [
  ...REQUIRED_LEAD_FIELDS,
  "referrer_customer_id",
];
