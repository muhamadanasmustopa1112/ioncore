export interface PopOltDetail {
  id: string;
  name: string;
  portsUsed: number;
  totalPorts: number;
  odpCount: number;
  status: 'active' | 'warning' | 'down';
  ipAddress: string;
  model: string;
}

export const DUMMY_OLT_DETAILS: Record<string, PopOltDetail[]> = {
  "pop-jaktim": [
    {
      id: "olt-1",
      name: "OLT CONDET RAISECOM",
      model: "Raisecom ISCOM5508",
      portsUsed: 12,
      totalPorts: 16,
      odpCount: 84,
      status: "active",
      ipAddress: "10.1.5.44",
    },
    {
      id: "olt-2",
      name: "OLT CIRACAS ZTE",
      model: "ZTE ZXA10 C320",
      portsUsed: 4,
      totalPorts: 8,
      odpCount: 32,
      status: "active",
      ipAddress: "10.1.5.45",
    },
  ],
  "pop-depok": [
    {
      id: "olt-3",
      name: "OLT CILANGKAP TAPOS",
      model: "ZTE ZXA10 C300",
      portsUsed: 28,
      totalPorts: 32,
      odpCount: 156,
      status: "active",
      ipAddress: "10.20.30.1",
    },
  ],
  "pop-klapanunggal": [
    {
      id: "olt-4",
      name: "OLT KLAPA NUNGGAL 2 RAISECOM",
      model: "Raisecom ISCOM5508",
      portsUsed: 14,
      totalPorts: 16,
      odpCount: 92,
      status: "active",
      ipAddress: "10.40.50.1",
    },
  ],
  "pop-pandeglang": [
    {
      id: "olt-pandeglang-1",
      name: "OLT PANDEGLANG LABUAN",
      model: "Huawei EA5800-X17",
      portsUsed: 8,
      totalPorts: 16,
      odpCount: 42,
      status: "active",
      ipAddress: "140.1.1.1",
    },
  ],
};
