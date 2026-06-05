export type DispatchQrKind = "asset" | "batch" | "unknown";

export interface ParsedDispatchQr {
  kind: DispatchQrKind;
  qr_payload: string;
  skuHint?: string;
}

export function parseDispatchQr(scannedValue: string): ParsedDispatchQr {
  const qr_payload = scannedValue.trim();
  if (!qr_payload) {
    return { kind: "unknown", qr_payload: "" };
  }

  const assetMatch = qr_payload.match(/^asset\/([^/]+)\/(.+)$/i);
  if (assetMatch) {
    return { kind: "asset", qr_payload, skuHint: assetMatch[1] };
  }

  const batchMatch = qr_payload.match(/^batch\/([^/]+)\/(.+)$/i);
  if (batchMatch) {
    return { kind: "batch", qr_payload, skuHint: batchMatch[1] };
  }

  return { kind: "unknown", qr_payload };
}
