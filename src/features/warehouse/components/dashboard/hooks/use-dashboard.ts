"use client";

import { useState } from "react";
import { useWarehouseStore } from "../../../store/warehouse";
import type { DashboardTab } from "../types";

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

  const [activeTab, setActiveTab] = useState<DashboardTab>("inventory");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All");

  const filteredAssets = assets.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && wo.status === statusFilter;
  });

  const filteredSerializedAssets = serializedAssets.filter((asset) => {
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

  const filteredRetrofitJobs = retrofitJobs.filter((job) => {
    return (
      job.resultAssetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.resultAssetSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
    filteredAssets,
    filteredWorkOrders,
    filteredSerializedAssets,
    filteredRetrofitJobs,
    serializedAssets,
    setAssetSheetOpen,
    setHandoverDialogOpen,
    setSelectedWorkOrderId,
    setRetrofitDialogOpen,
    updateAssetStatus,
  };
}
