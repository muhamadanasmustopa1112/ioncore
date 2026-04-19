import type { NodeTypeSource } from "./master-data-api";

export type { NodeTypeSource };

export type MasterDataFormMode = "new" | "edit" | "details" | null;

export interface NetworkNodeType {
  id: string;
  typeKey: string;
  label: string;
  description: string | null;
  iconOnline: string | null;
  iconOffline: string | null;
  iconTrouble: string | null;
  sortOrder: number;
  source: NodeTypeSource;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceNoticeConfig {
  customerType: string;
  defaultNoticeLeadHours: number;
  updatedAt: string;
  updatedBy: string | null;
}

export interface SeedDeployment {
  id: string;
  seedName: string;
  seedVersion: string;
  deployedAt: string;
  deployedBy: string;
  status: "applied" | "pending" | "rolled_back";
}

export const MAINTENANCE_CUSTOMER_TYPES = [
  { key: "broadband", label: "Broadband" },
  { key: "business", label: "Business" },
  { key: "enterprise", label: "Enterprise" },
  { key: "corporate", label: "Corporate" },
];
