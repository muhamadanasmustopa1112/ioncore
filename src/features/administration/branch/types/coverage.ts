export type CoverageFormMode = "new" | "edit" | "details" | null;

export interface CoverageData {
  id: string;
  branchId: string;
  areaName: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
