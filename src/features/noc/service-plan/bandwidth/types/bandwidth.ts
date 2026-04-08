export interface BandwidthData {
  id: string;
  bandwidthName: string;
  uploadMin: number;
  uploadMax: number;
  downloadMin: number;
  downloadMax: number;
  dataOwner: string;
  unit: "Kbps" | "Mbps" | "Gbps";
  description?: string;
  lastChecked: string; // Keeping for metadata/sorting consistency
}

