"use client";

import { useState } from "react";
import { QrCode, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScannerDialog } from "../scanner/scanner-dialog";
import { ScanResultBadge } from "../scanner/scan-result-badge";
import { matchScannedQR } from "../../utils/qr-matcher";
import { useWarehouseStore } from "../../store/warehouse";
import type { ScanResult } from "../../hooks/use-qr-scanner";
import type { StockLevel, WarehouseAsset } from "../../types";

export function QuickStockCheck() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<{
    name: string;
    sku: string;
    stock: number;
    threshold: number;
    uom: string;
    status: string;
  } | null>(null);

  const { serializedAssets, stockLevels, assets } = useWarehouseStore();

  const handleScan = (result: ScanResult) => {
    const match = matchScannedQR(result.text, serializedAssets, stockLevels, assets);

    if (match.type === "stock_item" && match.data) {
      const item = match.data as StockLevel;
      setLastScanned({
        name: item.stockItemName,
        sku: item.stockItemSku,
        stock: item.currentStock,
        threshold: item.threshold,
        uom: item.uom,
        status: item.alertStatus,
      });
    } else if (match.type === "asset" && match.data) {
      const asset = match.data as WarehouseAsset;
      setLastScanned({
        name: asset.name,
        sku: asset.sku,
        stock: 1,
        threshold: 0,
        uom: "pcs",
        status: asset.status,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button
        className="w-full h-16 text-lg gap-2"
        onClick={() => setScannerOpen(true)}
      >
        <QrCode className="size-6" />
        Scan Item
      </Button>

      {lastScanned && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">
                  {lastScanned.name}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  SKU: {lastScanned.sku}
                </p>
              </div>
              <Badge
                variant={
                  lastScanned.status === "Critical"
                    ? "destructive"
                    : lastScanned.status === "Warning"
                    ? "warning"
                    : "success"
                }
                appearance="light"
              >
                {lastScanned.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Current Stock
                </p>
                <p className="text-2xl font-extrabold text-foreground">
                  {lastScanned.stock}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {lastScanned.uom}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  Threshold
                </p>
                <p className="text-2xl font-extrabold text-foreground">
                  {lastScanned.threshold}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {lastScanned.uom}
                  </span>
                </p>
              </div>
            </div>

            {lastScanned.status === "Critical" && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="size-4 text-destructive" />
                <p className="text-xs text-destructive font-medium">
                  Stock below 50% threshold - reorder required
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onScan={handleScan}
        title="Quick Stock Check"
      />
    </div>
  );
}
