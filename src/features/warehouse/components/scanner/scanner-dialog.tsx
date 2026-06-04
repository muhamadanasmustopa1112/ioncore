"use client";

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
  if (!open) return null;

  return (
    <QRScanner
      onScan={(result) => {
        onScan(result);
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
      title={title}
    />
  );
}
