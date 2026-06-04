"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";

export interface ScanResult {
  text: string;
  format: string;
  timestamp: number;
}

export interface UseQRScannerOptions {
  onScan?: (result: ScanResult) => void;
  onError?: (error: string) => void;
  autoStop?: boolean;
}

export function useQRScanner(options: UseQRScannerOptions = {}) {
  const { onScan, onError, autoStop = true } = options;
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    if (!readerRef.current || !videoRef.current) return;

    setError(null);
    setScanResult(null);

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length === 0) {
        const msg = "No camera found on this device";
        setError(msg);
        onError?.(msg);
        return;
      }

      const backCamera =
        devices.find((d) => d.label.toLowerCase().includes("back")) || devices[0];

      setIsScanning(true);

      controlsRef.current = await readerRef.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        (result, _err, controls) => {
          if (result) {
            const scanResult: ScanResult = {
              text: result.getText(),
              format: result.getBarcodeFormat()?.toString() || "UNKNOWN",
              timestamp: Date.now(),
            };
            setScanResult(scanResult);
            onScan?.(scanResult);
            if (autoStop) {
              controls.stop();
              setIsScanning(false);
            }
          }
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to access camera";
      setError(msg);
      onError?.(msg);
      setIsScanning(false);
    }
  }, [onScan, onError, autoStop]);

  const resetScan = useCallback(() => {
    setScanResult(null);
    setError(null);
  }, []);

  const toggleTorch = useCallback(async () => {
    const controls = controlsRef.current;
    if (controls?.switchTorch) {
      try {
        await controls.switchTorch(true);
      } catch {
        // Torch not supported
      }
    }
  }, []);

  return {
    videoRef,
    isScanning,
    scanResult,
    error,
    startScanning,
    stopScanning,
    resetScan,
    toggleTorch,
  };
}
