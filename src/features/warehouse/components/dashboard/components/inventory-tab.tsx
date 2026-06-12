"use client";

import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardHeading, CardToolbar } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Package } from "lucide-react";
import type { StockItemResponse } from "../../../types/stock-item";

interface InventoryTabProps {
  items: StockItemResponse[];
  isLoading?: boolean;
  isMobile: boolean;
}

function InventoryMobileCard({ item }: { item: StockItemResponse }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
          {item.name}
        </span>
        <Badge
          variant={item.active ? "success" : "secondary"}
          appearance="light"
          className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0"
        >
          {item.active ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="text-[10px] text-slate-400 font-mono mb-2">
        SKU: {item.sku} • {item.category_code}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-300">
          {item.brand} {item.model}
        </span>
        <span className="text-slate-400">{item.unit}</span>
      </div>
    </div>
  );
}

export function InventoryTab({ items, isLoading, isMobile }: InventoryTabProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <InventoryMobileCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noInventoryAlert", "No inventory items found")}
          </div>
        )}
      </div>
    );
  }

  const activeCount = items.filter((item) => item.active).length;

  return (
    <Card>
      <CardHeader>
        <CardHeading>{t("warehouse.inventoryStock", "Inventory Stock & Alerts")}</CardHeading>
        <CardToolbar>
          <Badge variant="success" appearance="light">
            {activeCount} {t("common.active", "Active")}
          </Badge>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <Package className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noInventoryAlert", "No inventory items found")}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("warehouse.itemName", "Item Name")}</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>{t("warehouse.category", "Category")}</TableHead>
                <TableHead>{t("warehouse.brandModel", "Brand / Model")}</TableHead>
                <TableHead>{t("warehouse.unit", "Unit")}</TableHead>
                <TableHead>{t("warehouse.valuationMethod", "Valuation")}</TableHead>
                <TableHead>{t("warehouse.activeStatus", "Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell>{item.category_code}</TableCell>
                  <TableCell>
                    {item.brand} {item.model}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.valuation_method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.active ? "success" : "secondary"}
                      appearance="light"
                    >
                      {item.active
                        ? t("common.active", "Active")
                        : t("common.inactive", "Inactive")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
