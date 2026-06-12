"use client";

import { useMemo, useState } from "react";
import { useWarehouseStore } from "../../../store/warehouse";
import { useDashboardSummary } from "../../../api/get-dashboard-summary";
import { useStockItems } from "../../../api/get-stock-items";
import { useSerializedAssets } from "../../../api/get-serialized-assets";
import { useRetrofits } from "../../../api/get-retrofits";
import { useHandovers } from "../../../api/get-handovers";
import { DUMMY_METRICS, DUMMY_ONT_DISTRIBUTION, DUMMY_BRANCH_STOCK_LEVELS } from "../../../data/dummy-warehouse";
import type { DashboardTab } from "../types";
import type { WarehouseMetrics, OntDistributionData, BranchStockLevelData, WarehouseAsset, RetrofitJob, WorkOrder } from "../../../types";

const ASSETS_PAGE_SIZE = 10;
const INVENTORY_PAGE_SIZE = 20;

export function useDashboard() {
  const {
    searchQuery,
    setSearchQuery,
    assets,
    workOrders,
    setAssetSheetOpen,
    setHandoverDialogOpen,
    setSelectedWorkOrderId,
    serializedAssets,
    retrofitJobs,
    setRetrofitDialogOpen,
    updateAssetStatus,
  } = useWarehouseStore();

  const { data: dashboardResponse, isLoading: isDashboardLoading } = useDashboardSummary();

  const metrics: WarehouseMetrics = dashboardResponse?.data?.metrics ?? DUMMY_METRICS;
  const ontDistribution: OntDistributionData[] = dashboardResponse?.data?.ontDistribution ?? DUMMY_ONT_DISTRIBUTION;
  const branchStockLevels: BranchStockLevelData[] = dashboardResponse?.data?.branchStockLevels ?? DUMMY_BRANCH_STOCK_LEVELS;

  const [activeTab, setActiveTab] = useState<DashboardTab>("inventory");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All");
  const [assetsPage, setAssetsPage] = useState(1);
  const [retrofitsPage, setRetrofitsPage] = useState(1);
  const [handoversPage, setHandoversPage] = useState(1);

  const inventoryParams = useMemo(
    () => ({
      page: 1,
      limit: INVENTORY_PAGE_SIZE,
      search: activeTab === "inventory" && searchQuery ? searchQuery : undefined,
    }),
    [activeTab, searchQuery]
  );

  const { data: stockItemsResponse, isLoading: isStockItemsLoading } = useStockItems({
    params: inventoryParams,
    queryConfig: { enabled: activeTab === "inventory" },
  });

  const stockItems = stockItemsResponse?.data ?? [];
  const stockItemsMetadata = stockItemsResponse?.metadata;

  const serializedAssetsParams = useMemo(() => ({
    page: assetsPage,
    limit: ASSETS_PAGE_SIZE,
    search: searchQuery || undefined,
    status: statusFilter === "All" ? undefined : statusFilter,
  }), [assetsPage, searchQuery, statusFilter]);

  const { data: assetsResponse, isLoading: isAssetsLoading } = useSerializedAssets({
    params: serializedAssetsParams,
  });

  const serializedAssetsFromApi: WarehouseAsset[] = assetsResponse?.data ?? [];
  const serializedAssetsMetadata = assetsResponse?.metadata;

  const serializedAssetsFallback: WarehouseAsset[] = serializedAssetsFromApi.length > 0
    ? serializedAssetsFromApi
    : serializedAssets;

  const retrofitsParams = useMemo(() => ({
    page: retrofitsPage,
    limit: ASSETS_PAGE_SIZE,
    search: searchQuery || undefined,
  }), [retrofitsPage, searchQuery]);

  const { data: retrofitsResponse, isLoading: isRetrofitsLoading } = useRetrofits({
    params: retrofitsParams,
  });

  const retrofitsFromApi: RetrofitJob[] = retrofitsResponse?.data ?? [];
  const retrofitsMetadata = retrofitsResponse?.metadata;

  const handoversParams = useMemo(() => ({
    page: handoversPage,
    limit: ASSETS_PAGE_SIZE,
    search: searchQuery || undefined,
    status: statusFilter === "All" ? undefined : statusFilter,
  }), [handoversPage, searchQuery, statusFilter]);

  const { data: handoversResponse, isLoading: isHandoversLoading } = useHandovers({
    params: handoversParams,
  });

  const handoversFromApi: WorkOrder[] = handoversResponse?.data ?? [];
  const handoversMetadata = handoversResponse?.metadata;

  const filteredAssets = assets.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkOrders = useMemo(() => {
    if (handoversFromApi.length > 0) return handoversFromApi;

    return workOrders.filter((wo) => {
      const matchesSearch =
        wo.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (statusFilter === "All") return matchesSearch;
      return matchesSearch && wo.status === statusFilter;
    });
  }, [handoversFromApi, workOrders, searchQuery, statusFilter]);

  const filteredSerializedAssets = useMemo(() => {
    if (serializedAssetsFromApi.length > 0) return serializedAssetsFromApi;

    return serializedAssetsFallback.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        assetCategoryFilter === "All" || asset.category === assetCategoryFilter;
      const matchesStatus =
        statusFilter === "All" || asset.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [serializedAssetsFromApi, serializedAssetsFallback, searchQuery, assetCategoryFilter, statusFilter]);

  const filteredRetrofitJobs = useMemo(() => {
    if (retrofitsFromApi.length > 0) return retrofitsFromApi;

    return retrofitJobs.filter((job) => {
      return (
        job.resultAssetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.resultAssetSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [retrofitsFromApi, retrofitJobs, searchQuery]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setStatusFilter("All");
  };

  return {
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    assetCategoryFilter,
    setAssetCategoryFilter,
    metrics,
    ontDistribution,
    branchStockLevels,
    stockItems,
    stockItemsMetadata,
    filteredStockItems: stockItems,
    isStockItemsLoading,
    isLoading: isDashboardLoading,
    filteredAssets,
    filteredWorkOrders,
    filteredSerializedAssets,
    filteredRetrofitJobs,
    retrofitsMetadata,
    isRetrofitsLoading,
    retrofitsPage,
    setRetrofitsPage,
    handoversMetadata,
    isHandoversLoading,
    handoversPage,
    setHandoversPage,
    serializedAssetsMetadata,
    isAssetsLoading,
    assetsPage,
    setAssetsPage,
    setAssetSheetOpen,
    setHandoverDialogOpen,
    setSelectedWorkOrderId,
    setRetrofitDialogOpen,
    updateAssetStatus,
  };
}
