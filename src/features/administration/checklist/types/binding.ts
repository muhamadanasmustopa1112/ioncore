import type { WoType, MaintenanceSubtype } from "./checklist-template";

export type { WoType, MaintenanceSubtype };

export type BindingFormMode = "new" | "edit" | null;

export interface ChecklistBinding {
  id: string;
  woType: WoType;
  maintenanceSubtype: MaintenanceSubtype | null;
  productType: string;
  templateId: string;
  templateName: string;
  templateVersion: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceChangePolicy {
  id: string;
  serviceChangeType: string;
  fromPackageCode: string | null;
  toPackageCode: string | null;
  requiresChecklistType: WoType;
  notes: string;
  createdAt: string;
}

export const PRODUCT_TYPES = [
  "broadband",
  "enterprise",
  "cctv",
  "iptv",
];

export const WO_TYPE_COLS: { key: WoType | string; label: string; maintenanceSubtype?: MaintenanceSubtype }[] = [
  { key: "new_installation", label: "New Install" },
  { key: "maintenance_hardware_swap", label: "Maint · HW Swap", maintenanceSubtype: "hardware_swap" },
  { key: "maintenance_signal_issue", label: "Maint · Signal", maintenanceSubtype: "signal_issue" },
  { key: "maintenance_config", label: "Maint · Config", maintenanceSubtype: "config" },
  { key: "termination", label: "Termination" },
  { key: "infrastructure_deployment", label: "Infrastructure" },
];
