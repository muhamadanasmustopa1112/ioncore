"use client";

import { Warehouse, Router, Cable, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MobileMetricCard } from "./mobile-metric-card";
import { Card, CardContent } from "@/components/ui/card";
import type { WarehouseMetrics } from "../../../types";

interface DashboardKpiProps {
  isMobile: boolean;
  metrics: WarehouseMetrics;
}

export function DashboardKpi({ isMobile, metrics }: DashboardKpiProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <MobileMetricCard
          title={t("warehouse.totalWarehouses", "Warehouses")}
          value={metrics.totalWarehouses}
          icon={Warehouse}
          delta={metrics.totalWarehousesDelta}
          deltaType="up"
        />
        <MobileMetricCard
          title={t("warehouse.fiberStock", "Fiber Stock")}
          value={`${metrics.fiberStockKm} km`}
          icon={Cable}
          delta={metrics.fiberStockDelta}
          deltaType={metrics.fiberStockTrend === "down" ? "down" : "up"}
        />
        <MobileMetricCard
          title={t("warehouse.ontInstalled", "ONT Installed")}
          value={metrics.installedOnt.toLocaleString()}
          icon={Router}
          delta={metrics.ontRatioDelta}
          deltaType="up"
        />
        <MobileMetricCard
          title={t("warehouse.ontWarehouse", "ONT Stock")}
          value={metrics.warehouseOnt.toLocaleString()}
          icon={Warehouse}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t("warehouse.totalWarehouses", "Total Warehouses")}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {metrics.totalWarehouses}
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
              <Warehouse className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
            <span className="flex items-center text-green-600 font-bold gap-0.5">
              <TrendingUp className="size-3.5" />
              {metrics.totalWarehousesDelta}
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
                {metrics.installedOnt.toLocaleString()} / {metrics.warehouseOnt.toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
              <Router className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
            <span className="flex items-center text-green-600 font-bold gap-0.5">
              <TrendingUp className="size-3.5" />
              {metrics.ontRatioDelta}
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
                {metrics.fiberStockKm} km
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-700 dark:text-blue-400">
              <Cable className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-400">
            <span className={`flex items-center font-bold gap-0.5 ${metrics.fiberStockTrend === "down" ? "text-red-500" : "text-green-600"}`}>
              {metrics.fiberStockTrend === "down" ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
              {metrics.fiberStockDelta}
            </span>
            <span>{t("common.vsLastMonth", "vs last month")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
