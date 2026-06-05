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
import { ShoppingCart, AlertCircle } from "lucide-react";
import { MobileTableCard } from "./mobile-table-card";
import type { LowStockAlertData } from "../../../types";

interface InventoryTabProps {
  filteredAssets: LowStockAlertData[];
  isMobile: boolean;
  onReorder?: (item: { name: string; sku: string }) => void;
}

export function InventoryTab({ filteredAssets, isMobile, onReorder }: InventoryTabProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {filteredAssets.map((item, index) => (
          <MobileTableCard
            key={index}
            name={item.name}
            sku={item.sku}
            category={item.category}
            stock={item.units}
            uom={item.uom}
            threshold={item.threshold}
            status={item.status}
            onAction={onReorder ? () => onReorder({ name: item.name, sku: item.sku }) : undefined}
          />
        ))}
        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noInventoryAlert", "No inventory items found")}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardHeading>{t("warehouse.inventoryStock", "Inventory Stock & Alerts")}</CardHeading>
        <CardToolbar>
          <Badge variant="destructive" appearance="light">
            {filteredAssets.filter((a) => a.status === "Critical").length} Critical
          </Badge>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("warehouse.itemName", "Item Name")}</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>{t("warehouse.category", "Category")}</TableHead>
              <TableHead className="text-right">{t("warehouse.stock", "Stock")}</TableHead>
              <TableHead className="text-right">{t("warehouse.threshold", "Threshold")}</TableHead>
              <TableHead>{t("warehouse.status", "Status")}</TableHead>
              <TableHead>{t("warehouse.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right font-bold">{item.units} {item.uom}</TableCell>
                <TableCell className="text-right">{item.threshold} {item.uom}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "Critical" ? "destructive" : "warning"}
                    appearance="light"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onReorder?.({ name: item.name, sku: item.sku })}>
                    <ShoppingCart className="size-3.5 mr-1" />
                    {t("warehouse.reorder", "Reorder")}
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
