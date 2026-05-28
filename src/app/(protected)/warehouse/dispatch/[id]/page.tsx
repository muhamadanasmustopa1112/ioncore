"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Truck, Package, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { paths } from "@/config/paths";

export default function DispatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { dispatches, updateDispatchStatus } = useWarehouseStore();
  const dispatch = dispatches.find((d) => d.id === id);

  if (!dispatch) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-400">{t("warehouse.dispatchNotFound", "Dispatch not found.")}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() },
          { title: t("warehouse.dispatchTitle", "WO Dispatch"), path: paths.dashboard.warehouse.dispatch.root.getHref() },
          { title: dispatch.woNumber },
        ]}
      />

      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Truck className="size-6 text-blue-700" />
            {dispatch.woNumber}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dispatch.woType} • {dispatch.technicianName}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          <Link href={paths.dashboard.warehouse.dispatch.root.getHref()}>
            <Button variant="outline" className="h-10 px-4 font-semibold shadow-xs gap-2">
              <ArrowLeft className="size-4" />
              {t("common.back", "Back")}
            </Button>
          </Link>
          {dispatch.status === "pending" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2"
              onClick={() => updateDispatchStatus(dispatch.id, "dispatched")}
            >
              <Truck className="size-4" />
              {t("warehouse.markDispatched", "Mark Dispatched")}
            </Button>
          )}
          {dispatch.status === "dispatched" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2 bg-emerald-700 hover:bg-emerald-800"
              onClick={() => updateDispatchStatus(dispatch.id, "completed")}
            >
              <Package className="size-4" />
              {t("warehouse.markCompleted", "Mark Completed")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("common.status", "Status")}</p>
            <div className="mt-2">
              <Badge
                variant={dispatch.status === "completed" ? "success" : dispatch.status === "dispatched" ? "info" : "warning"}
                appearance="light"
                className="font-bold text-sm px-3 py-1 rounded-full uppercase"
              >
                {dispatch.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.warehouseLabel", "Warehouse")}</p>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{dispatch.warehouseName}</h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.technician", "Technician")}</p>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{dispatch.technicianName}</h3>
            <p className="text-xs text-slate-400">{dispatch.technicianRole}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("common.date", "Date Created")}</p>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {new Date(dispatch.dateCreated).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* BOM Items */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="size-4 text-blue-700" />
            {t("warehouse.billOfMaterials", "Bill of Materials (BOM)")}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemDetails", "Item")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemType", "Type")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.qtyRequired", "Required")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.qtyDispatched", "Dispatched")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.serialNumbers", "Serial Numbers")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {dispatch.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.stockItemName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.stockItemSku}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {item.itemType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.qtyRequired} {item.uom}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.qtyDispatched} {item.uom}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {item.serialNumbers && item.serialNumbers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.serialNumbers.map((sn, i) => (
                          <Badge key={i} variant="outline" className="text-[9px] font-mono gap-1">
                            <QrCode className="size-2.5" />
                            {sn}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
