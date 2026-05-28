"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Database, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { paths } from "@/config/paths";

export default function StockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { stockLevels } = useWarehouseStore();
  const item = stockLevels.find((sl) => sl.id === id);

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-400">{t("warehouse.stockItemNotFound", "Stock item not found.")}</p>
      </div>
    );
  }

  const percentage = item.threshold > 0 ? Math.round((item.currentStock / item.threshold) * 100) : 100;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() },
          { title: t("warehouse.stockTitle", "Stock & Alerts"), path: paths.dashboard.warehouse.stock.root.getHref() },
          { title: item.stockItemName },
        ]}
      />

      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {item.stockItemName}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            SKU: {item.stockItemSku} • {item.warehouseName}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          <Link href={paths.dashboard.warehouse.stock.root.getHref()}>
            <Button variant="outline" className="h-10 px-4 font-semibold shadow-xs gap-2">
              <ArrowLeft className="size-4" />
              {t("common.back", "Back")}
            </Button>
          </Link>
        </ToolbarActions>
      </Toolbar>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.currentStock", "Current Stock")}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {item.currentStock.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{item.uom}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.thresholdLabel", "Threshold")}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {item.threshold.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{item.uom}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.stockRatio", "Stock Ratio")}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {percentage}%
            </h3>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${percentage <= 50 ? "bg-red-500" : percentage <= 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.alertStatus", "Alert Status")}</p>
            <div className="mt-3">
              <Badge
                variant={item.alertStatus === "Critical" ? "destructive" : item.alertStatus === "Warning" ? "warning" : "success"}
                appearance="light"
                className="font-bold text-sm px-3 py-1 rounded-full uppercase"
              >
                {item.alertStatus === "Critical" && <AlertTriangle className="size-3.5 mr-1" />}
                {item.alertStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Item Details */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
        <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="size-4 text-blue-700" />
            {t("warehouse.itemInformation", "Item Information")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.category", "Category")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 capitalize">{item.stockItemCategory.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.itemType", "Item Type")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 capitalize">{item.stockItemType}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.warehouseLabel", "Warehouse")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{item.warehouseName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.branch", "Branch")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{item.warehouseBranch}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
