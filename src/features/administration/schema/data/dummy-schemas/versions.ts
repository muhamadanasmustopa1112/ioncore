import { SchemaVersion } from "../../types";

// ---------------------------------------------------------------------------
// DUMMY_SCHEMA_VERSIONS — version history for Billing Standard - Residential
// ---------------------------------------------------------------------------

export const DUMMY_SCHEMA_VERSIONS: SchemaVersion[] = [
  {
    id: "ver-bil-001-v1",
    schema_id: "schema-bil-001",
    version: "v1.0",
    status: "ARCHIVED",
    change_reason: "Initial release",
    content: {},
    created_by: "user-001",
    updated_by: "user-002",
    published_by: "user-002",
    published_at: "2026-01-10T08:00:00Z",
    created_at: "2026-01-05T07:00:00Z",
    updated_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "ver-bil-001-v2",
    schema_id: "schema-bil-001",
    version: "v1.1",
    status: "ARCHIVED",
    change_reason: "Penyesuaian denda keterlambatan dari 3% menjadi 2%",
    content: {},
    created_by: "user-001",
    updated_by: "user-002",
    published_by: "user-002",
    published_at: "2026-02-01T08:00:00Z",
    created_at: "2026-01-28T09:00:00Z",
    updated_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "ver-bil-001-v3",
    schema_id: "schema-bil-001",
    version: "v1.2",
    status: "PUBLISHED",
    change_reason: "Penambahan metode pembayaran QRIS",
    content: {},
    created_by: "user-001",
    updated_by: "user-002",
    published_by: "user-002",
    published_at: "2026-03-01T08:00:00Z",
    created_at: "2026-02-25T10:00:00Z",
    updated_at: "2026-03-01T08:00:00Z",
  },
];
