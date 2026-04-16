export type CoverageFormMode = "new" | "edit" | "details" | null;

export interface CoverageData {
  id: string;
  branchId: string;
  name: string;
  description: string;
  isActive: boolean;
  coverageJson: {
    service_area: string[];
    warehouse_coverage: string[];
    network_scope: string;
    dispatch_radius_km: number;
  };
  createdAt: string;
  updatedAt: string;
}
