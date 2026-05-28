"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowLeftRight, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { paths } from "@/config/paths";

export default function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { transfers, updateTransferStatus } = useWarehouseStore();
  const transfer = transfers.find((tr) => tr.id === id);

  if (!transfer) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-400">{t("warehouse.transferNotFound", "Transfer not found.")}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4 space-y-6">
      <PageBreadcrumb
        items={[
          { title: t("common.home", "Home"), path: "/dashboard" },
          { title: t("menu.warehouse", "Warehouse & Asset"), path: paths.dashboard.warehouse.root.getHref() },
          { title: t("warehouse.transfersTitle", "Transfers"), path: paths.dashboard.warehouse.transfers.root.getHref() },
          { title: transfer.id },
        ]}
      />

      <Toolbar className="items-center pb-2">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ArrowLeftRight className="size-6 text-blue-700" />
            {transfer.id}
          </ToolbarTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {transfer.sourceWarehouseName} → {transfer.destinationWarehouseName}
          </p>
        </ToolbarHeading>
        <ToolbarActions className="flex items-center gap-3">
          <Link href={paths.dashboard.warehouse.transfers.root.getHref()}>
            <Button variant="outline" className="h-10 px-4 font-semibold shadow-xs gap-2">
              <ArrowLeft className="size-4" />
              {t("common.back", "Back")}
            </Button>
          </Link>
          {transfer.status === "pending" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2"
              onClick={() => updateTransferStatus(transfer.id, "in_transit")}
            >
              {t("warehouse.markInTransit", "Mark In Transit")}
            </Button>
          )}
          {transfer.status === "in_transit" && (
            <Button
              variant="primary"
              className="h-10 px-5 font-semibold shadow-md gap-2 bg-emerald-700 hover:bg-emerald-800"
              onClick={() => updateTransferStatus(transfer.id, "received")}
            >
              <CheckCircle className="size-4" />
              {t("warehouse.confirmReceipt", "Confirm Receipt")}
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("common.status", "Status")}</p>
            <div className="mt-2">
              <Badge
                variant={transfer.status === "received" ? "success" : transfer.status === "in_transit" ? "info" : "warning"}
                appearance="light"
                className="font-bold text-sm px-3 py-1 rounded-full uppercase"
              >
                {transfer.status.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.fromTo", "Route")}</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="size-4 text-blue-700" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">{transfer.sourceWarehouseName}</span>
              <span className="text-slate-400">→</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{transfer.destinationWarehouseName}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 dark:border-slate-800">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("warehouse.initiatedBy", "Initiated By")}</p>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-2">{transfer.initiatedByName}</h3>
            <p className="text-xs text-slate-400">{new Date(transfer.dateInitiated).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-slate-50 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            {t("warehouse.transferItems", "Transfer Items")}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemDetails", "Item")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.itemType", "Type")}</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">{t("warehouse.quantity", "Quantity")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transfer.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.stockItemName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.stockItemSku}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{item.itemType}</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {item.qty.toLocaleString()} {item.uom}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {transfer.notes && (
        <Card className="border-slate-100 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t("warehouse.notes", "Notes")}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{transfer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
