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
import { QrCode, AlertCircle } from "lucide-react";
import type { WarehouseAsset } from "../../../types";

interface AssetsTabProps {
  filteredAssets: WarehouseAsset[];
  isMobile: boolean;
  onAssign?: (asset: WarehouseAsset) => void;
}

export function AssetsTab({ filteredAssets, isMobile, onAssign }: AssetsTabProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {filteredAssets.map((asset, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {asset.name}
              </span>
              <Badge variant="secondary" appearance="light" className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0">
                {asset.status}
              </Badge>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              S/N: {asset.serialNumber} • {asset.category}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {asset.warehouseName || asset.branchName || "N/A"}
            </div>
            {onAssign && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-8 text-xs font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                onClick={() => onAssign(asset)}
              >
                <QrCode className="size-3.5 mr-1" />
                {t("warehouse.assign", "Assign")}
              </Button>
            )}
          </div>
        ))}
        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noAssetsAlert", "No serialized assets found")}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardHeading>{t("warehouse.serializedAssets", "Serialized Assets (Lifecycle)")}</CardHeading>
        <CardToolbar>
          <Badge variant="secondary" appearance="light">
            {filteredAssets.length} Assets
          </Badge>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("warehouse.assetName", "Asset Name")}</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>{t("warehouse.serialNumber", "Serial Number")}</TableHead>
              <TableHead>{t("warehouse.category", "Category")}</TableHead>
              <TableHead>{t("warehouse.status", "Status")}</TableHead>
              <TableHead>{t("warehouse.location", "Location")}</TableHead>
              <TableHead>{t("warehouse.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell className="font-mono text-xs">{asset.sku}</TableCell>
                <TableCell className="font-mono text-xs">{asset.serialNumber}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>
                  <Badge variant="secondary" appearance="light">
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{asset.warehouseName || asset.branchName || "N/A"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onAssign?.(asset)}>
                    <QrCode className="size-3.5 mr-1" />
                    {t("warehouse.assign", "Assign")}
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
