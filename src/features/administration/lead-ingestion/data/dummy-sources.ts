import { ExternalSource, FieldMapping } from "../types/lead-ingestion";

export const DUMMY_SOURCES: ExternalSource[] = [
  {
    id: "src-001",
    name: "ION Public Web Form",
    type: "web_form",
    apiKey: "wf_2GqaLmZxKpV9NbR4tYsW",
    webhookUrl: "https://api.ion.id/ingest/v1/leads/src-001",
    defaultBranchId: "",
    defaultLeadType: "broadband",
    defaultCustomerSubType: "residential",
    defaultSource: "website",
    status: "active",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-04-15T10:30:00Z",
  },
  {
    id: "src-002",
    name: "Tokopedia Partner Feed",
    type: "marketplace",
    apiKey: "mk_8TgHnK3vBwQp7XdEzAcJ",
    webhookUrl: "https://api.ion.id/ingest/v1/leads/src-002",
    defaultBranchId: "",
    defaultLeadType: "broadband",
    defaultCustomerSubType: "residential",
    defaultSource: "referral",
    status: "active",
    createdAt: "2026-03-10T08:00:00Z",
    updatedAt: "2026-03-10T08:00:00Z",
  },
  {
    id: "src-003",
    name: "Partner Reseller API — PT Konekta",
    type: "partner_api",
    apiKey: "pa_5LdMpYnSjFtUkRcVeWxQ",
    webhookUrl: "https://api.ion.id/ingest/v1/leads/src-003",
    defaultBranchId: "",
    defaultLeadType: "enterprise",
    defaultCustomerSubType: "business",
    defaultSource: "referral",
    status: "inactive",
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-04-01T11:00:00Z",
  },
];

export const DUMMY_MAPPINGS: Record<string, FieldMapping> = {
  "src-001": {
    sourceId: "src-001",
    rows: [
      { id: "m1", externalField: "full_name", internalField: "lead_name", defaultValue: "" },
      { id: "m2", externalField: "plan_type", internalField: "lead_type", defaultValue: "broadband" },
    ],
  },
  "src-002": {
    sourceId: "src-002",
    rows: [
      { id: "m1", externalField: "buyer_name", internalField: "lead_name", defaultValue: "" },
    ],
  },
};
