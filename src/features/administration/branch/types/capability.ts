export type CapabilityFormMode = "new" | "edit" | "details" | null;

export interface CapabilityData {
  id: string;
  branchId: string;
  capabilityKey: string;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
