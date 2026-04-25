import { SchemaRecord, SuspensionContent } from "../../types";

// ---------------------------------------------------------------------------
// Suspension Schemas
// ---------------------------------------------------------------------------

const suspensionResidentialContent: SuspensionContent = {
  schema_name: "Suspension Standard",
  customer_type: "residential",
  suspension: {
    automatic: true,
    trigger: "after_grace_period",
    requires_manual_approval: false,
    requires_executive_approval: false,
    ion_radius_action: "full_block",
    throttle_speed_kbps: 512,
    notification: true,
    notification_channels: ["whatsapp", "email"],
  },
  restoration: {
    automatic: true,
    trigger: "on_payment_confirmed",
    requires_manual_trigger: false,
    requires_approval: false,
    ion_radius_action: "restore",
  },
  termination_trigger: {
    enabled: true,
    trigger_basis: "days_after_suspension",
    days: 30,
    waive_early_termination_penalty: true,
    notify_customer_days_before: 7,
    auto_create_wo: true,
    requires_approval: false,
    notify_internal: ["finance", "ops_admin"],
  },
};

export const SUSPENSION_SCHEMAS: SchemaRecord[] = [
  {
    id: "schema-sus-001",
    schema_type: "suspension",
    name: "Suspension Standard",
    customer_type: "residential",
    latest_version: "v1.0",
    created_by: "user-001",
    updated_by: "user-002",
  },
  {
    id: "schema-sus-002",
    schema_type: "suspension",
    name: "Suspension Enterprise",
    customer_type: "enterprise",
    latest_version: "v1.0",
    created_by: "user-003",
    updated_by: "user-003",
  },
];
