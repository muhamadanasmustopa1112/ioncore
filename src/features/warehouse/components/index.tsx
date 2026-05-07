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

import { useWarehouseStore } from "../store/warehouse";
import { AssetFormSheet } from "./form/asset-form-sheet";
import { HandoverDialog } from "./handover/handover-dialog";
import { HandoverDetailDialog } from "./handover/handover-detail-dialog";
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
  const {
    searchQuery,
    setSearchQuery,
    assets,
    workOrders,
    setAssetSheetOpen,
    setHandoverDialogOpen,
    setSelectedWorkOrderId,
  } = useWarehouseStore();

  const [activeTab, setActiveTab] = useState<"inventory" | "collections">("inventory");
  const [statusFilter, setStatusFilter] = useState("All");

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

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumb
        items={[
          { title: "Home", path: "/dashboard" },
          { title: "Warehouse & Asset" },
          { title: activeTab === "inventory" ? "Inventory & Stock" : "Goods Collection" },
        ]}
      />

      {/* Main Header */}
      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeTab === "inventory" ? "Warehouse & Asset Management" : "Goods Collection (Technician Pick-up)"}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === "inventory"
              ? "Real-time stock levels, low-stock warnings, and device dispatch monitoring."
              : "Manage and track equipment collection by technicians for assigned work orders."}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <Input
              type="text"
              placeholder={activeTab === "inventory" ? "Search assets..." : "Search technicians..."}
              className="pl-9 h-10 w-full text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === "collections" ? (
            <Button
              variant="primary"
              className="h-10 px-5 font-bold text-xs shadow-md gap-2 active:scale-95 transition-all"
              onClick={() => setHandoverDialogOpen(true)}
            >
              <Plus className="size-4" />
              New Dispatch
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-10 px-4 font-semibold shadow-xs gap-2"
                onClick={() => setHandoverDialogOpen(true)}
              >
                <QrCode className="size-4 text-blue-700" />
                QR Handover
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold shadow-md gap-2"
                onClick={() => setAssetSheetOpen(true)}
              >
                <Plus className="size-4" />
                Register Asset
              </Button>
            </>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-6">
        <button
          onClick={() => {
            setActiveTab("inventory");
            setSearchQuery("");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "inventory"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          Inventory Stock & Alerts
        </button>
        <button
          onClick={() => {
            setActiveTab("collections");
            setSearchQuery("");
          }}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "collections"
              ? "text-blue-700 dark:text-blue-400 border-b-2 border-blue-700"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          Goods Collection (Technician Pick-up)
        </button>
      </div>

      {/* TAB 1: INVENTORY STOCK */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Total Warehouses
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
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      ONT Ratio (Installed / Stock)
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
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Fiber Cable Stock
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
                  <span>vs last month</span>
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
                    ONT Distribution (Warehouse vs Installed)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comparison between deployed devices and standby warehouse stocks.
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
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Units</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-3.5 rounded-md bg-blue-700" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Installed</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">8,450 (80%)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-3.5 rounded-md bg-slate-300 dark:bg-slate-700" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Warehouse</p>
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
                    Stock Levels by Branch
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standalone units available inside active regional branch warehouses.
                  </CardDescription>
                </CardHeading>
                <CardToolbar>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-700" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Units in Stock
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
                  Stock & Low Stock Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Items requiring immediate restocking or threshold overrides.
                </CardDescription>
              </CardHeading>
              <Button
                variant="ghost"
                className="text-blue-700 dark:text-blue-400 text-xs font-bold h-auto p-0 hover:underline"
                onClick={() => setAssetSheetOpen(true)}
              >
                Add New Asset
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Item Details</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Stock Status</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Threshold</TableHead>
                    <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider text-right">Action</TableHead>
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

      {/* TAB 2: GOODS COLLECTION */}
      {activeTab === "collections" && (
        <div className="space-y-6">
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
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
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
                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
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
    </div>
  );
}
