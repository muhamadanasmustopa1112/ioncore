export type CapabilityFormMode = "new" | "edit" | "details" | null;

export interface CapabilityData {
  id: string;
  branchId: string;
  name: string;
  description: string;
  isActive: boolean;
  capabilityJson: {
    sales: boolean;
    helpdesk: boolean;
    dispatch: boolean;
    stock_holding: boolean;
    monitoring: boolean;
    collection: boolean;
    approval: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
