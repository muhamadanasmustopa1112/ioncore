import { SchemaVersion } from "../../types";

// ---------------------------------------------------------------------------
// DUMMY_SCHEMA_VERSIONS — version history for Billing Standard - Residential
// ---------------------------------------------------------------------------

export const DUMMY_SCHEMA_VERSIONS: SchemaVersion[] = [
  {
    id: "ver-bil-001-v1",
    schema_type: "billing",
    name: "Billing Standard - Residential",
    customer_type: "residential",
    version: "1.0",
    status: "archived",
    change_reason: "Initial release",
    published_by: "user-002",
    published_at: "2026-01-10T08:00:00Z",
    created_at: "2026-01-05T07:00:00Z",
  },
  {
    id: "ver-bil-001-v2",
    schema_type: "billing",
    name: "Billing Standard - Residential",
    customer_type: "residential",
    version: "1.1",
    status: "archived",
    change_reason: "Penyesuaian denda keterlambatan dari 3% menjadi 2%",
    published_by: "user-002",
    published_at: "2026-02-01T08:00:00Z",
    created_at: "2026-01-28T09:00:00Z",
  },
  {
    id: "ver-bil-001-v3",
    schema_type: "billing",
    name: "Billing Standard - Residential",
    customer_type: "residential",
    version: "1.2",
    status: "published",
    change_reason: "Penambahan metode pembayaran QRIS",
    published_by: "user-002",
    published_at: "2026-03-01T08:00:00Z",
    created_at: "2026-02-25T10:00:00Z",
  },
];
