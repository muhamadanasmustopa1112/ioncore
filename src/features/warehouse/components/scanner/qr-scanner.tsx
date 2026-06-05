"use client";

import { useCallback, useEffect } from "react";
import { Flashlight, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQRScanner, type ScanResult } from "../../hooks/use-qr-scanner";

interface QRScannerProps {
  onScan: (result: ScanResult) => void;
  onClose: () => void;
  title?: string;
}

export function QRScanner({ onScan, onClose, title = "Scan QR Code" }: QRScannerProps) {
  const {
    videoRef,
    isScanning,
    scanResult,
    error,
    startScanning,
    stopScanning,
    toggleTorch,
  } = useQRScanner({
    onScan,
    autoStop: true,
  });

  useEffect(() => {
    void startScanning();
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = useCallback(() => {
    void startScanning();
  }, [startScanning]);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 bg-background/90 backdrop-blur-sm border-b border-border">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTorch}>
            <Flashlight className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          autoPlay
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative w-64 h-64">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-destructive" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-destructive" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-destructive" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-destructive" />

            {isScanning && (
              <div className="absolute inset-x-2 top-0 h-0.5 bg-destructive animate-[scan_2s_linear_infinite]" />
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          {error && (
            <div className="text-center">
              <p className="text-destructive-foreground/80 text-sm mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30"
                onClick={handleRetry}
              >
                <RotateCcw className="size-4 mr-1" />
                Retry
              </Button>
            </div>
          )}
          {!error && !scanResult && isScanning && (
            <p className="text-white/80 text-xs text-center">
              Point camera at QR code
            </p>
          )}
          {scanResult && (
            <div className="text-center">
              <p className="text-green-400 text-sm font-bold mb-1">Scanned!</p>
              <p className="text-white text-xs font-mono truncate">{scanResult.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
