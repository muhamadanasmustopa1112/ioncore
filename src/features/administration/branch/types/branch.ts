export type BranchLevel = "regional" | "area" | "sub_area";
export type BranchType = "office" | "noc" | "warehouse" | "hybrid";
export type BranchFormMode = "new" | "edit" | "details" | null;
export type GeographicPolygon = Record<string, unknown> | unknown[];

export interface BranchData {
  id: string;
  name: string;
  code: string;
  level: BranchLevel;
  parentId: string | null;
  parentName?: string;
  branchType?: BranchType;
  address?: string;
  cable_route_factor?: number;
  geographic_polygon?: GeographicPolygon;
  lat?: number;
  long?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Internal fields used for nested API routing — not displayed in UI
  _regionalId?: string;
  _areaId?: string;
  _regionalName?: string;
  _areaName?: string;
}
