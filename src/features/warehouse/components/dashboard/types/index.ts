export type DashboardTab = "inventory" | "assets" | "retrofits" | "collections";

export interface DashboardFilters {
  searchQuery: string;
  statusFilter: string;
  assetCategoryFilter: string;
}
