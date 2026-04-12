import { SchemaRecord, ServiceContent } from "../../types";

// ---------------------------------------------------------------------------
// Service Schemas
// ---------------------------------------------------------------------------

const serviceResidentialContent: ServiceContent = {
  schema_name: "Service Standard SLA",
  customer_type: "residential",
  sla: {
    uptime_guarantee_percentage: 99,
    response_time_hours: 4,
    resolution_time_hours: 24,
  },
  bandwidth_profile: {
    type: "best_effort",
    contention_ratio: "1:8",
  },
  support_tier: "standard",
  maintenance_window: {
    allowed: true,
    schedule: "Minggu 00:00–06:00 WIB",
  },
};

const serviceEnterpriseContent: ServiceContent = {
  schema_name: "Service Enterprise SLA",
  customer_type: "enterprise",
  sla: {
    uptime_guarantee_percentage: 99.9,
    response_time_hours: 1,
    resolution_time_hours: 4,
  },
  bandwidth_profile: {
    type: "dedicated",
    contention_ratio: "1:1",
  },
  support_tier: "dedicated",
  maintenance_window: {
    allowed: true,
    schedule: "Minggu 02:00–04:00 WIB (dengan notifikasi 3 hari sebelumnya)",
  },
};

export const SERVICE_SCHEMAS: SchemaRecord[] = [
  {
    id: "schema-svc-001",
    schema_type: "service",
    name: "Service Standard SLA",
    customer_type: "residential",
    version: "1.0",
    status: "published",
    content: serviceResidentialContent,
    change_reason: "Initial release",
    created_by: "user-001",
    published_by: "user-002",
    published_at: "2026-01-10T08:00:00Z",
    created_at: "2026-01-05T07:00:00Z",
    updated_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "schema-svc-002",
    schema_type: "service",
    name: "Service Enterprise SLA",
    customer_type: "enterprise",
    version: "1.1",
    status: "draft",
    content: {},
    change_reason: "Peningkatan SLA uptime menjadi 99.95%",
    created_by: "user-003",
    created_at: "2026-04-07T11:00:00Z",
    updated_at: "2026-04-07T11:00:00Z",
  },
];
