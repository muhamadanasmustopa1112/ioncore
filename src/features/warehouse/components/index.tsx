"use client";

import React, { useState } from "react";
import {
  Warehouse,
  Router,
  Cable,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  ShoppingCart,
  Search,
  QrCode,
  Clock,
  Layers,
  Archive,
  Truck,
  Gauge,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Wrench,
  Activity,
  FileSpreadsheet,
  Coins,
  History,
  ClipboardList,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardDescription,
  CardToolbar,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

import { useWarehouseStore } from "../store/warehouse";
import { AssetFormSheet } from "./form/asset-form-sheet";
import { HandoverDialog } from "./handover/handover-dialog";
import { HandoverDetailDialog } from "./handover/handover-detail-dialog";
import { RetrofitDialog } from "./handover/retrofit-dialog";
import {
  DUMMY_METRICS,
  DUMMY_ONT_DISTRIBUTION,
  DUMMY_BRANCH_STOCK_LEVELS,
} from "../data/dummy-warehouse";

const chartConfig = {
  installed: {
    label: "Installed",
    color: "#0052cc", // primary blue
  },
  warehouse: {
    label: "Warehouse",
    color: "#cbd5e1", // neutral slate
  },
} satisfies ChartConfig;

export function WarehouseDashboard() {
  const { t } = useTranslation();
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

  const [activeTab, setActiveTab] = useState<"inventory" | "collections" | "assets" | "retrofits">("inventory");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All");

  // Filtering low stock alerts
  const filteredAssets = assets.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtering work orders
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && wo.status === statusFilter;
  });

  // Filtering serialized assets (Lifecycle tab)
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

  // Filtering retrofit jobs
  const filteredRetrofitJobs = retrofitJobs.filter((job) => {
    return (
      job.resultAssetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.resultAssetSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset") },
          {
            title:
              activeTab === "inventory"
                ? t("warehouse.tabInventory", "Inventory Stock & Alerts")
                : activeTab === "collections"
                ? t("warehouse.tabCollections", "Goods Collection (Technician Pick-up)")
                : activeTab === "assets"
                ? t("warehouse.tabAssets", "Serialized Assets (Lifecycle)")
                : t("warehouse.tabRetrofits", "Asset Retrofits (Cannibalization)"),
          },
        ]}
      />

      {/* Main Header */}
      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeTab === "inventory" && t("warehouse.title", "Warehouse & Asset Management")}
            {activeTab === "collections" && t("warehouse.collectionsTitle", "Goods Collection (Technician Pick-up)")}
            {activeTab === "assets" && t("warehouse.serializedTitle", "Serialized Asset Registry")}
            {activeTab === "retrofits" && t("warehouse.retrofitsTitle", "Asset Retrofits & Cannibalization Log")}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "inventory" && t("warehouse.inventorySubtitle", "Real-time stock levels, low-stock warnings, and device dispatch monitoring.")}
            {activeTab === "collections" && t("warehouse.collectionsSubtitle", "Manage and track equipment collection by technicians for assigned work orders.")}
            {activeTab === "assets" && t("warehouse.assetsSubtitle", "Track unique serial numbers, received timestamps, purchase costs, and active operational statuses.")}
            {activeTab === "retrofits" && t("warehouse.retrofitsSubtitle", "Assemble operational customer equipment by harvesting components from defective physical assets.")}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <Input
              type="text"
              placeholder={
                activeTab === "inventory"
                  ? t("warehouse.searchAssets", "Search assets...")
                  : activeTab === "collections"
                  ? t("warehouse.searchTechnicians", "Search technicians...")
                  : activeTab === "assets"
                  ? t("warehouse.searchSerialSku", "Search serial or SKU...")
                  : t("warehouse.searchRetrofitNotes", "Search retrofit notes...")
              }
              className="pl-9 h-10 w-full text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "collections" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-bold text-xs shadow-md gap-2 active:scale-95 transition-all"
              onClick={() => setHandoverDialogOpen(true)}
            >
              <Plus className="size-4" />
              {t("warehouse.newDispatch", "New Dispatch")}
            </Button>
          )}

          {activeTab === "inventory" && (
            <>
              <Button
                variant="outline"
                className="h-10 px-4 font-semibold shadow-xs gap-2"
                onClick={() => setHandoverDialogOpen(true)}
              >
                <QrCode className="size-4 text-blue-700" />
                {t("warehouse.qrHandover", "QR Handover")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold shadow-md gap-2"
                onClick={() => setAssetSheetOpen(true)}
              >
                <Plus className="size-4" />
                {t("warehouse.registerAsset", "Register Asset")}
              </Button>
            </>
          )}

          {activeTab === "assets" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2"
              onClick={() => setAssetSheetOpen(true)}
            >
              <Plus className="size-4" />
              {t("warehouse.registerNewAsset", "Register New Asset")}
            </Button>
          )}

          {activeTab === "retrofits" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-bold text-xs shadow-md gap-2 bg-indigo-700 hover:bg-indigo-800"
              onClick={() => setRetrofitDialogOpen(true)}
            >
              <Wrench className="size-4" />
              {t("warehouse.performRetrofitJob", "Perform Retrofit Job")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
        <button
          onClick={() => {
            setActiveTab("inventory");
            setSearchQuery("");
            setStatusFilter("All");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "inventory"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {t("warehouse.tabInventory", "Inventory Stock & Alerts")}
        </button>
        <button
          onClick={() => {
            setActiveTab("assets");
            setSearchQuery("");
            setStatusFilter("All");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "assets"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {t("warehouse.tabAssets", "Serialized Assets (Lifecycle)")}
        </button>
        <button
          onClick={() => {
            setActiveTab("retrofits");
            setSearchQuery("");
            setStatusFilter("All");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "retrofits"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {t("warehouse.tabRetrofits", "Asset Retrofits (Cannibalization)")}
        </button>
        <button
          onClick={() => {
            setActiveTab("collections");
            setSearchQuery("");
            setStatusFilter("All");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "collections"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          {t("warehouse.tabCollections", "Goods Collection (Technician Pick-up)")}
        </button>
      </div>

      {/* TAB 1: INVENTORY STOCK */}
      {activeTab === "inventory" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t("warehouse.totalWarehouses", "Total Warehouses")}
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {DUMMY_METRICS.totalWarehouses}
                    </h3>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
                    <Warehouse className="size-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center text-green-600 font-bold gap-0.5">
                    <TrendingUp className="size-3.5" />
                    {DUMMY_METRICS.totalWarehousesDelta}
                  </span>
                  <span>{t("common.vsLastMonth", "vs last month")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t("warehouse.ontRatio", "ONT Ratio (Installed / Stock)")}
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {DUMMY_METRICS.installedOnt.toLocaleString()} / {DUMMY_METRICS.warehouseOnt.toLocaleString()}
                    </h3>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
                    <Router className="size-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center text-green-600 font-bold gap-0.5">
                    <TrendingUp className="size-3.5" />
                    {DUMMY_METRICS.ontRatioDelta}
                  </span>
                  <span>{t("common.vsLastMonth", "vs last month")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {t("warehouse.fiberStock", "Fiber Cable Stock")}
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {DUMMY_METRICS.fiberStockKm} km
                    </h3>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
                    <Cable className="size-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center text-red-500 font-bold gap-0.5">
                    <TrendingDown className="size-3.5" />
                    {DUMMY_METRICS.fiberStockDelta}
                  </span>
                  <span>{t("common.vsLastMonth", "vs last month")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                <CardHeading>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    {t("warehouse.ontDistribution", "ONT Distribution (Warehouse vs Installed)")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("warehouse.ontDistributionDesc", "Comparison between deployed devices and standby warehouse stocks.")}
                  </CardDescription>
                </CardHeading>
              </CardHeader>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-around gap-6 h-64">
                <div className="relative size-44">
                  <ChartContainer config={chartConfig} className="w-full h-full aspect-square">
                    <PieChart>
                      <Pie
                        data={DUMMY_ONT_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {DUMMY_ONT_DISTRIBUTION.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? "var(--color-installed)" : "var(--color-warehouse)"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">10,550</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t("warehouse.totalUnits", "Total Units")}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-3.5 rounded-md bg-blue-700" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("warehouse.installed", "Installed")}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">8,450 (80%)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-3.5 rounded-md bg-slate-300 dark:bg-slate-700" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("warehouse.warehouseLabel", "Warehouse")}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">2,100 (20%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
              <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                <CardHeading>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    {t("warehouse.stockLevelsBranch", "Stock Levels by Branch")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t("warehouse.stockLevelsBranchDesc", "Standalone units available inside active regional branch warehouses.")}
                  </CardDescription>
                </CardHeading>
                <CardToolbar>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-700" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {t("warehouse.unitsInStock", "Units in Stock")}
                    </span>
                  </div>
                </CardToolbar>
              </CardHeader>
              <CardContent className="p-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DUMMY_BRANCH_STOCK_LEVELS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="branch"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      fontWeight={600}
                      tickFormatter={(val) => val.toUpperCase()}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      fontWeight={600}
                    />
                    <Bar
                      dataKey="units"
                      fill="#0052cc"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alerts */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <CardHeading>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {t("warehouse.stockLowStockAlerts", "Stock & Low Stock Alerts")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t("warehouse.stockLowStockAlertsDesc", "Items requiring immediate restocking or threshold overrides.")}
                </CardDescription>
              </CardHeading>
              <Button
                variant="ghost"
                className="text-blue-700 dark:text-blue-400 text-xs font-bold h-auto p-0 hover:underline"
                onClick={() => setAssetSheetOpen(true)}
              >
                {t("warehouse.addNewAsset", "Add New Asset")}
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemDetails", "Item Details")}</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.stockStatus", "Stock Status")}</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.thresholdLabel", "Threshold")}</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider text-right">{t("common.actions", "Action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredAssets.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          SKU: {item.sku} • Category: {item.category}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.units} {item.uom}
                          </span>
                          <Badge
                            variant={item.status === "Critical" ? "destructive" : "warning"}
                            appearance="light"
                            className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-slate-400">
                        {item.threshold} {item.uom}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg">
                          <ShoppingCart className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SERIALIZED ASSETS (Matching PostgreSQL 'assets' table) */}
      {activeTab === "assets" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
              <select
                value={assetCategoryFilter}
                onChange={(e) => setAssetCategoryFilter(e.target.value)}
                className="pl-2 pr-7 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-200"
              >
                <option value="All">All Categories</option>
                <option value="customer_equipment">Customer Equipment</option>
                <option value="field_tool">Field Tools</option>
                <option value="infrastructure_equipment">Infrastructure</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-2 pr-7 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 cursor-pointer text-slate-600 dark:text-slate-200"
              >
                <option value="All">All Statuses</option>
                <option value="in_warehouse">In Warehouse</option>
                <option value="dispatched">Dispatched</option>
                <option value="installed">Installed</option>
                <option value="assigned">Assigned</option>
                <option value="in_use">In Use</option>
                <option value="defective">Defective</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="cannibalized">Cannibalized</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>

            <div className="flex-1" />

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredSerializedAssets.length} serialized items
            </span>
          </div>

          {/* Grid/Table of Serialized Assets */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Item / SKU</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Serial & QR Code</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Cost & Intake</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Location / Deploy</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Status</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredSerializedAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                        No serialized assets matched the criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSerializedAssets.map((asset) => (
                      <TableRow key={asset.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                        {/* Item Details */}
                        <TableCell className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {asset.name}
                            {asset.isRetrofit && (
                              <Badge className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-900 uppercase">
                                Retrofit
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            SKU: {asset.sku} •{" "}
                            <span className="capitalize">
                              {asset.category.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>

                        {/* Serial & QR */}
                        <TableCell className="px-6 py-4">
                          <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {asset.serialNumber || "NO SERIAL"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <QrCode className="size-3 text-slate-400" />
                            {asset.qrCode}
                          </div>
                        </TableCell>

                        {/* Cost & Intake */}
                        <TableCell className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <Coins className="size-3.5 text-emerald-600" />
                            IDR {asset.purchaseCost.toLocaleString("id-ID")}
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="size-3 text-slate-400" />
                            {new Date(asset.receivedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>

                        {/* Location / Assignee */}
                        <TableCell className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {asset.status === "installed" && asset.customerName && (
                            <div>Customer: {asset.customerName}</div>
                          )}
                          {asset.status === "installed" && asset.branchName && (
                            <div>Branch: {asset.branchName}</div>
                          )}
                          {(asset.status === "assigned" || asset.status === "in_use") &&
                            asset.assignedTechnicianName && (
                              <div>Tech: {asset.assignedTechnicianName}</div>
                            )}
                          {asset.status === "in_warehouse" && asset.warehouseName && (
                            <div>Gudang: {asset.warehouseName}</div>
                          )}
                          {!asset.warehouseName && !asset.customerName && !asset.assignedTechnicianName && !asset.branchName && (
                            <span className="text-slate-400 font-normal italic">N/A</span>
                          )}
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="px-6 py-4">
                          <Badge
                            className={`font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              asset.status === "in_warehouse"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : asset.status === "defective"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                : asset.status === "cannibalized"
                                ? "bg-slate-100 text-slate-500 line-through dark:bg-slate-900 dark:text-slate-500"
                                : asset.status === "installed"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                                : asset.status === "assigned" || asset.status === "in_use"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}
                          >
                            {asset.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-4 text-right">
                          <select
                            value={asset.status}
                            onChange={(e) =>
                              updateAssetStatus(asset.id, e.target.value as any)
                            }
                            className="text-[10px] font-bold p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none cursor-pointer text-slate-600 dark:text-slate-300"
                          >
                            <option value="in_warehouse">Set: In Warehouse</option>
                            <option value="defective">Set: Defective</option>
                            <option value="under_maintenance">Set: Maintenance</option>
                            <option value="disposed">Set: Disposed</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: RETROFITTING & CANNIBALIZATION LOG */}
      {activeTab === "retrofits" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Subsystem summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50/25 dark:bg-indigo-950/10 p-5 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/30 flex justify-between items-center h-28 group">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                  Defective Units Available
                </span>
                <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {serializedAssets.filter((a) => a.status === "defective").length}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Ready for Cannibalization</p>
              </div>
              <div className="bg-indigo-100/50 dark:bg-indigo-950/40 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Wrench className="size-6" />
              </div>
            </div>

            <div className="bg-slate-50/30 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-center h-28">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Cannibalized Components Used
                </span>
                <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {serializedAssets.filter((a) => a.status === "cannibalized").length}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Sourced from defective parts</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl text-slate-500">
                <Layers className="size-6" />
              </div>
            </div>

            <div className="bg-emerald-50/25 dark:bg-emerald-950/10 p-5 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/30 flex justify-between items-center h-28">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Retrofit Success Rate
                </span>
                <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">100%</p>
                <p className="text-[10px] text-slate-400 mt-1">Zero testing failures in field</p>
              </div>
              <div className="bg-emerald-100/50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-6" />
              </div>
            </div>
          </div>

          {/* Retrofit Jobs list */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
              <CardHeading>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Retrofit Assembly Jobs History
                </CardTitle>
                <CardDescription className="text-xs">
                  Full lineage trace of which physical serial numbers were disassembled to produce a retrofit unit.
                </CardDescription>
              </CardHeading>
              <Button
                onClick={() => setRetrofitDialogOpen(true)}
                variant="primary"
                className="h-9 px-4 font-bold text-xs bg-indigo-700 hover:bg-indigo-800 shadow gap-1.5"
              >
                <Plus className="size-4" />
                Assemble Unit
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Job ID / Date</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Assembled Resulting Asset</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Cannibalized Harvested Parts</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Performed By & Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredRetrofitJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-slate-400 text-xs">
                        No retrofit jobs recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRetrofitJobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition-colors">
                        {/* Job ID & performedAt */}
                        <TableCell className="px-6 py-4">
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 font-mono block">
                            {job.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            <Clock className="size-3 text-slate-400" />
                            {new Date(job.performedAt).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </TableCell>

                        {/* Result Asset */}
                        <TableCell className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {job.resultAssetName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            SKU: {job.resultAssetSku} • Serial:{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {job.resultAssetSerial}
                            </span>
                          </div>
                        </TableCell>

                        {/* Harvested Parts */}
                        <TableCell className="px-6 py-4">
                          <div className="space-y-1.5">
                            {job.components.map((comp) => (
                              <div
                                key={comp.sourceAssetId}
                                className="flex flex-col bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-150 dark:border-slate-800 text-[10px] max-w-xs"
                              >
                                <div className="flex justify-between font-bold">
                                  <span className="text-slate-400 uppercase text-[9px] tracking-wide">
                                    {comp.componentRole}
                                  </span>
                                  <span className="text-red-500 uppercase text-[8px] tracking-wider font-bold bg-red-50 dark:bg-red-950/20 px-1 rounded">
                                    Cannibalized
                                  </span>
                                </div>
                                <div className="text-slate-800 dark:text-slate-200 mt-1 font-semibold leading-tight">
                                  {comp.name}
                                </div>
                                <div className="text-slate-400 font-mono text-[9px] mt-0.5">
                                  Serial: {comp.serialNumber}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>

                        {/* Performed By & Notes */}
                        <TableCell className="px-6 py-4 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                            <Avatar className="size-5">
                              <AvatarFallback className="text-[9px] bg-slate-100 text-slate-600 font-bold">
                                AP
                              </AvatarFallback>
                            </Avatar>
                            {job.performedByName}
                          </div>
                          {job.woNumber && (
                            <div className="mt-1 font-mono text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <ClipboardList className="size-3" />
                              WO: {job.woNumber}
                            </div>
                          )}
                          <p className="text-[11px] text-slate-500 italic mt-2 max-w-sm font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-900/20 p-2 rounded border border-slate-100 dark:border-slate-800">
                            &ldquo;{job.notes}&rdquo;
                          </p>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: GOODS COLLECTION */}
      {activeTab === "collections" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Pending Collections</span>
                <Clock className="text-slate-400 group-hover:text-primary transition-colors size-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">12</span>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">+2 from yesterday</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ready for Pickup</span>
                <Archive className="text-slate-400 group-hover:text-primary transition-colors size-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">8</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">66% of total</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Goods Circulating</span>
                <Truck className="text-slate-400 group-hover:text-primary transition-colors size-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">4</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full font-bold">In field</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 hover:border-blue-200 transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collection Rate</span>
                <Gauge className="text-slate-400 group-hover:text-primary transition-colors size-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">94%</span>
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-4">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Table Section */}
          <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary cursor-pointer text-slate-600 dark:text-slate-200"
                >
                  <option value="All">Status: All</option>
                  <option value="Pending">Goods Ready (Pending)</option>
                  <option value="Completed">Circulating (Completed)</option>
                </select>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredWorkOrders.length} entries
              </span>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Order Number</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technician Name</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                    <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredWorkOrders.map((wo) => (
                    <TableRow key={wo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-400 font-mono">
                          {wo.id}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={wo.avatarUrl} alt={wo.technicianName} />
                            <AvatarFallback className="text-[10px] font-bold">{wo.technicianName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{wo.technicianName}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Field Technician</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            wo.status === "Pending"
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              wo.status === "Pending" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {wo.status === "Pending" ? "Goods Ready" : "Circulating"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          onClick={() => setSelectedWorkOrderId(wo.id)}
                          variant="ghost"
                          className="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary-container rounded transition-all active:scale-95"
                        >
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Workflow tips section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <div className="bg-blue-700 rounded-xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Technician Workflow Tip</h3>
                <p className="text-sm text-blue-100 leading-relaxed max-w-md">
                  Ensure technicians provide a digital signature on the ION Mobile App before equipment hand-over. All serial numbers are logged automatically upon pickup.
                </p>
                <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors border border-white/20">
                  Read Collection Manual
                  <ExternalLink className="size-3.5" />
                </button>
              </div>
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">System Integrity</h3>
                  <p className="text-xs text-slate-500">Real-time inventory synchronization enabled.</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                &ldquo;The ION Network Warehouse &amp; Asset system maintains a 99.8% data accuracy rate across all regional collection hubs.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sheets & Overlay Dialogs */}
      <AssetFormSheet />
      <HandoverDialog />
      <HandoverDetailDialog />
      <RetrofitDialog />
    </div>
  );
}
