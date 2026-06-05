"use client";

import { useCallback } from "react";
import { QRScanner } from "./qr-scanner";
import type { ScanResult } from "../../hooks/use-qr-scanner";

interface ScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (result: ScanResult) => void;
  title?: string;
}

export function ScannerDialog({
  open,
  onOpenChange,
  onScan,
  title,
}: ScannerDialogProps) {
  const handleScan = useCallback(
    (result: ScanResult) => {
      onScan(result);
      onOpenChange(false);
    },
    [onScan, onOpenChange]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <QRScanner
      key="warehouse-scanner"
      onScan={handleScan}
      onClose={handleClose}
      title={title}
    />
  );
}
