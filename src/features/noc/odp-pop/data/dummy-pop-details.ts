export interface PopDeviceDetail {
  id: string;
  name: string;
  type: 'OLT' | 'Router' | 'Core Switch';
  model: string;
  ipAddress: string;
  status: 'active' | 'warning' | 'down';
  portsUsed?: number;
  totalPorts?: number;
  rackPos?: string;
}

export interface PopOdpDetail {
  id: string;
  name: string;
  capacity: string;
  status: 'active' | 'warning' | 'down';
  filled: number;
  total: number;
  address: string;
}

export const DUMMY_DEVICE_DETAILS: Record<string, PopDeviceDetail[]> = {
  "pop-jaktim": [
    { id: "dev-1", name: "NY-CORE-01", type: "Core Switch", model: "Cisco Nexus 9k", ipAddress: "10.1.1.1", status: "active", rackPos: "Rack 01-A" },
    { id: "dev-3", name: "NY-EDGE-02", type: "Router", model: "Juniper MX960", ipAddress: "10.1.2.2", status: "warning", rackPos: "Rack 01-C" },
  ],
  "pop-depok": [
    { id: "dev-4", name: "DP-CORE-01", type: "Core Switch", model: "Cisco Nexus 9k", ipAddress: "10.20.1.1", status: "active", rackPos: "Rack A1" },
  ],
  "pop-klapanunggal": [
    { id: "dev-6", name: "KLP-CORE-01", type: "Core Switch", model: "Huawei CloudEngine", ipAddress: "10.40.1.1", status: "active", rackPos: "Rack 1-A" },
  ]
};

export const DUMMY_ODP_DETAILS: Record<string, PopOdpDetail[]> = {
  "pop-jaktim": [
    { id: "odp-1", name: "ODP-NY-001", capacity: "1:8", status: "active", filled: 6, total: 8, address: "123 Tech Park Ave" },
  ],
};
