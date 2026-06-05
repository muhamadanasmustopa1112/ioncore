"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  BrowserQRCodeReader,
  BrowserCodeReader,
  type IScannerControls,
} from "@zxing/browser";

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

const SCAN_OPTIONS = {
  delayBetweenScanAttempts: 750,
  delayBetweenScanSuccess: 400,
};

export function useQRScanner(options: UseQRScannerOptions = {}) {
  const { onScan, onError, autoStop = true } = options;
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const sessionRef = useRef(0);

  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const autoStopRef = useRef(autoStop);

  useEffect(() => {
    onScanRef.current = onScan;
    onErrorRef.current = onError;
    autoStopRef.current = autoStop;
  });

  const stopScanning = useCallback(() => {
    sessionRef.current += 1;
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

  const stopScanningRef = useRef(stopScanning);
  stopScanningRef.current = stopScanning;

  const startScanning = useCallback(async () => {
    if (!readerRef.current || !videoRef.current) return;

    stopScanningRef.current();
    const session = sessionRef.current;

    setError(null);
    setScanResult(null);

    try {
      const devices = await BrowserCodeReader.listVideoInputDevices();
      if (session !== sessionRef.current) return;

      if (devices.length === 0) {
        const msg = "No camera found on this device";
        setError(msg);
        onErrorRef.current?.(msg);
        return;
      }

      const backCamera =
        devices.find((d) => d.label.toLowerCase().includes("back")) || devices[0];

      setIsScanning(true);

      const controls = await readerRef.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        (result) => {
          if (session !== sessionRef.current || !result) return;

          const nextResult: ScanResult = {
            text: result.getText(),
            format: result.getBarcodeFormat()?.toString() || "QR_CODE",
            timestamp: Date.now(),
          };
          setScanResult(nextResult);
          onScanRef.current?.(nextResult);
          if (autoStopRef.current) {
            stopScanningRef.current();
          }
        }
      );

      if (session !== sessionRef.current) {
        controls.stop();
        return;
      }

      controlsRef.current = controls;
    } catch (err) {
      if (session !== sessionRef.current) return;
      const msg = err instanceof Error ? err.message : "Failed to access camera";
      setError(msg);
      onErrorRef.current?.(msg);
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    readerRef.current = new BrowserQRCodeReader(undefined, SCAN_OPTIONS);
    return () => {
      stopScanningRef.current();
      BrowserCodeReader.releaseAllStreams();
      readerRef.current = null;
    };
  }, []);

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
