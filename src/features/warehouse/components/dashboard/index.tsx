"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "./hooks/use-dashboard";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardKpi } from "./components/dashboard-kpi";
import { DashboardTabs } from "./components/dashboard-tabs";
import { InventoryTab } from "./components/inventory-tab";
import { AssetsTab } from "./components/assets-tab";
import { RetrofitsTab } from "./components/retrofits-tab";
import { CollectionsTab } from "./components/collections-tab";
import { QuickStockCheck } from "../stock/quick-stock-check";
import { AssetFormSheet } from "../form/asset-form-sheet";
import { HandoverDialog } from "../handover/handover-dialog";
import { HandoverDetailDialog } from "../handover/handover-detail-dialog";
import { RetrofitDialog } from "../handover/retrofit-dialog";

export function WarehouseDashboardPage() {
  const isMobile = useIsMobile();
  const [quickCheckOpen, setQuickCheckOpen] = useState(false);
  const {
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    filteredAssets,
    filteredWorkOrders,
    filteredSerializedAssets,
    filteredRetrofitJobs,
    setAssetSheetOpen,
    setHandoverDialogOpen,
    setSelectedWorkOrderId,
    setRetrofitDialogOpen,
  } = useDashboard();

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 ${isMobile ? "pb-16" : ""}`}>
      <div className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddAsset={() => setAssetSheetOpen(true)}
        />

        <DashboardKpi isMobile={isMobile} />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isMobile={isMobile}
        />

        <div className="mt-4">
          {activeTab === "inventory" && (
            <InventoryTab
              filteredAssets={filteredAssets}
              isMobile={isMobile}
              onReorder={(item) => {
                console.log("Reorder:", item);
              }}
            />
          )}
          {activeTab === "assets" && (
            <AssetsTab
              filteredAssets={filteredSerializedAssets}
              isMobile={isMobile}
              onAssign={(asset) => {
                console.log("Assign:", asset);
              }}
            />
          )}
          {activeTab === "retrofits" && (
            <RetrofitsTab
              filteredJobs={filteredRetrofitJobs}
              isMobile={isMobile}
              onNewRetrofit={() => setRetrofitDialogOpen(true)}
            />
          )}
          {activeTab === "collections" && (
            <CollectionsTab
              filteredWorkOrders={filteredWorkOrders}
              isMobile={isMobile}
              onHandover={(wo) => {
                setSelectedWorkOrderId(wo.id);
                setHandoverDialogOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <AssetFormSheet />
      <HandoverDialog />
      <HandoverDetailDialog />
      <RetrofitDialog />

      {isMobile && (
        <Button
          className="fixed bottom-20 right-4 z-40 size-14 rounded-full shadow-lg"
          onClick={() => setQuickCheckOpen(true)}
        >
          <QrCode className="size-6" />
        </Button>
      )}

      {quickCheckOpen && (
        <div className="fixed inset-0 z-50 bg-background p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Quick Stock Check</h2>
            <Button variant="ghost" size="sm" onClick={() => setQuickCheckOpen(false)}>
              Close
            </Button>
          </div>
          <QuickStockCheck />
        </div>
      )}
    </div>
  );
}
