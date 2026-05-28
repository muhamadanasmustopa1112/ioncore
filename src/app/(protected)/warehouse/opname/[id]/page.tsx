"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { paths } from "@/config/paths";

export default function OpnameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { opnames } = useWarehouseStore();
  const opname = opnames.find((o) => o.id === id);

  if (!opname) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-400">{t("warehouse.opnameNotFound", "Opname session not found.")}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() },
          { title: t("warehouse.opnameTitle", "Stock Opname"), path: paths.dashboard.warehouse.opname.root.getHref() },
          { title: opname.id },
        ]}
      />

      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ClipboardCheck className="size-6 text-blue-700" />
            {opname.id}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {opname.warehouseName} • {new Date(opname.scheduledDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          <Link href={paths.dashboard.warehouse.opname.root.getHref()}>
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("common.status", "Status")}</p>
            <div className="mt-2">
              <Badge
                variant={opname.status === "adjusted" ? "success" : opname.status === "completed" ? "info" : opname.status === "in_progress" ? "warning" : "secondary"}
                appearance="light"
                className="font-bold text-sm px-3 py-1 rounded-full uppercase"
              >
                {opname.status.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.totalItems", "Total Items")}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{opname.items.length}</h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.discrepancies", "Discrepancies")}</p>
            <h3 className={`text-3xl font-extrabold mt-1 ${opname.totalDiscrepancies > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {opname.totalDiscrepancies}
            </h3>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.initiatedBy", "Initiated By")}</p>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-2">{opname.initiatedByName}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Count Items */}
      {opname.items.length > 0 && (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              {t("warehouse.countResults", "Count Results")}
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                <TableRow>
                  <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemDetails", "Item")}</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.systemCount", "System Count")}</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.actualCount", "Actual Count")}</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.variance", "Variance")}</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("common.status", "Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {opname.items.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.stockItemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.stockItemSku}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.systemCount.toLocaleString()} {item.uom}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {item.countedCount !== null ? `${item.countedCount.toLocaleString()} ${item.uom}` : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`text-xs font-bold ${item.variance > 0 ? "text-emerald-600" : item.variance < 0 ? "text-red-600" : "text-slate-400"}`}>
                        {item.variance > 0 ? "+" : ""}{item.variance.toLocaleString()} {item.uom}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant={item.status === "adjusted" ? "success" : item.status === "discrepancy" ? "destructive" : "secondary"}
                        appearance="light"
                        className="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
