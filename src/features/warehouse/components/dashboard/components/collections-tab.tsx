"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardHeading, CardToolbar } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, AlertCircle } from "lucide-react";
import type { WorkOrder } from "../../../types";

interface CollectionsTabProps {
  filteredWorkOrders: WorkOrder[];
  isMobile: boolean;
  onHandover?: (wo: WorkOrder) => void;
}

export function CollectionsTab({ filteredWorkOrders, isMobile, onHandover }: CollectionsTabProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {filteredWorkOrders.map((wo, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {wo.technicianName}
              </span>
              <Badge variant="secondary" appearance="light" className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0">
                {wo.status}
              </Badge>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              WO: {wo.id} • {wo.equipmentList.length} items
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {wo.dateCreated}
            </div>
            {onHandover && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-8 text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                onClick={() => onHandover(wo)}
              >
                <Truck className="size-3.5 mr-1" />
                {t("warehouse.handover", "Handover")}
              </Button>
            )}
          </div>
        ))}
        {filteredWorkOrders.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noCollectionsAlert", "No goods collection orders found")}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardHeading>{t("warehouse_goodsCollection", "Goods Collection (Technician Pick-up)")}</CardHeading>
        <CardToolbar>
          <Badge variant="secondary" appearance="light">
            {filteredWorkOrders.length} Orders
          </Badge>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("warehouse.workOrderId", "Work Order ID")}</TableHead>
              <TableHead>{t("warehouse.technician", "Technician")}</TableHead>
              <TableHead>{t("warehouse.status", "Status")}</TableHead>
              <TableHead className="text-right">{t("warehouse.items", "Items")}</TableHead>
              <TableHead>{t("warehouse.scheduledDate", "Scheduled Date")}</TableHead>
              <TableHead>{t("warehouse.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkOrders.map((wo, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">{wo.id}</TableCell>
                <TableCell>{wo.technicianName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" appearance="light">
                    {wo.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold">{wo.equipmentList.length}</TableCell>
                <TableCell>{wo.dateCreated}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onHandover?.(wo)}>
                    <Truck className="size-3.5 mr-1" />
                    {t("warehouse.handover", "Handover")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
