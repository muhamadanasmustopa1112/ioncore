"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, RotateCcw, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { paths } from "@/config/paths";

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { deviceReturns, updateReturnStatus } = useWarehouseStore();
  const record = deviceReturns.find((r) => r.id === id);

  if (!record) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-400">{t("warehouse.returnNotFound", "Return record not found.")}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() },
          { title: t("warehouse.returnsTitle", "Device Returns"), path: paths.dashboard.warehouse.returns.root.getHref() },
          { title: record.id },
        ]}
      />

      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <RotateCcw className="size-6 text-blue-700" />
            {record.id}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {record.assetName} • {record.customerName}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          <Link href={paths.dashboard.warehouse.returns.root.getHref()}>
            <Button variant="outline" className="h-10 px-4 font-semibold shadow-xs gap-2">
              <ArrowLeft className="size-4" />
              {t("common.back", "Back")}
            </Button>
          </Link>
          {record.status === "pending_return" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2"
              onClick={() => updateReturnStatus(record.id, "received")}
            >
              {t("warehouse.markReceived", "Mark Received")}
            </Button>
          )}
          {record.status === "received" && record.condition === "good" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2 bg-emerald-700 hover:bg-emerald-800"
              onClick={() => updateReturnStatus(record.id, "restocked")}
            >
              {t("warehouse.restockDevice", "Restock Device")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("common.status", "Status")}</p>
            <div className="mt-2">
              <Badge
                variant={record.status === "restocked" ? "success" : record.status === "received" ? "info" : record.status === "pending_return" ? "warning" : "secondary"}
                appearance="light"
                className="font-bold text-sm px-3 py-1 rounded-full uppercase"
              >
                {record.status.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.ownership", "Ownership")}</p>
            <Badge variant="outline" className="text-sm font-bold uppercase mt-2">
              {record.ownership.replace("_", " ")}
            </Badge>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.condition", "Condition")}</p>
            <div className="mt-2">
              {record.condition ? (
                <Badge variant={record.condition === "good" ? "success" : "destructive"} appearance="light" className="font-bold text-sm px-3 py-1 rounded-full uppercase">
                  {record.condition}
                </Badge>
              ) : (
                <span className="text-sm text-slate-400">{t("warehouse.notAssessed", "Not assessed")}</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.woNumber", "WO Number")}</p>
            <h3 className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 mt-2">{record.woNumber}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Device Details */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
        <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="size-4 text-blue-700" />
            {t("warehouse.deviceDetails", "Device Details")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.deviceName", "Device")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{record.assetName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKU</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white mt-1">{record.assetSku}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.serialNumber", "Serial Number")}</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white mt-1">{record.serialNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">QR Code</p>
              <p className="text-sm font-mono font-semibold text-slate-900 dark:text-white mt-1">{record.qrCode}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.customer", "Customer")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{record.customerName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("common.date", "Date Initiated")}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {new Date(record.dateInitiated).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            {record.warehouseName && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.warehouseLabel", "Warehouse")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{record.warehouseName}</p>
              </div>
            )}
            {record.receivedBy && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("warehouse.receivedBy", "Received By")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{record.receivedBy}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {record.notes && (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t("warehouse.notes", "Notes")}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{record.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
