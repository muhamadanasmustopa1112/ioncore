export interface OdpListItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  ponPort: string;
  splitters: number;
  portsUsed: number;
  totalPorts: number;
  signalLevel: number;
}

export const DUMMY_ODP_LIST: Record<string, OdpListItem[]> = {
  "olt-1": [
    { id: "odp-1-1", name: "ODP-COND-A-001", latitude: -6.2614, longitude: 106.8674, ponPort: "PON 1/1", splitters: 2, portsUsed: 10, totalPorts: 16, signalLevel: -18.5 },
    { id: "odp-1-2", name: "ODP-COND-A-002", latitude: -6.2638, longitude: 106.8701, ponPort: "PON 1/1", splitters: 1, portsUsed: 6, totalPorts: 8, signalLevel: -19.2 },
    { id: "odp-1-3", name: "ODP-COND-B-001", latitude: -6.2592, longitude: 106.8655, ponPort: "PON 1/2", splitters: 2, portsUsed: 14, totalPorts: 16, signalLevel: -21.0 },
    { id: "odp-1-4", name: "ODP-COND-B-002", latitude: -6.2571, longitude: 106.8643, ponPort: "PON 1/2", splitters: 1, portsUsed: 4, totalPorts: 8, signalLevel: -17.8 },
    { id: "odp-1-5", name: "ODP-COND-C-001", latitude: -6.2650, longitude: 106.8720, ponPort: "PON 1/3", splitters: 2, portsUsed: 12, totalPorts: 16, signalLevel: -20.3 },
  ],
  "olt-2": [
    { id: "odp-2-1", name: "ODP-CIRC-A-001", latitude: -6.3108, longitude: 106.9021, ponPort: "PON 1/1", splitters: 1, portsUsed: 7, totalPorts: 8, signalLevel: -18.0 },
    { id: "odp-2-2", name: "ODP-CIRC-A-002", latitude: -6.3125, longitude: 106.9045, ponPort: "PON 1/2", splitters: 2, portsUsed: 5, totalPorts: 16, signalLevel: -22.1 },
  ],
  "olt-3": [
    { id: "odp-3-1", name: "ODP-CILA-A-001", latitude: -6.4012, longitude: 106.9234, ponPort: "PON 1/1", splitters: 2, portsUsed: 16, totalPorts: 16, signalLevel: -19.5 },
    { id: "odp-3-2", name: "ODP-CILA-A-002", latitude: -6.4033, longitude: 106.9258, ponPort: "PON 1/1", splitters: 2, portsUsed: 14, totalPorts: 16, signalLevel: -20.8 },
    { id: "odp-3-3", name: "ODP-CILA-B-001", latitude: -6.4055, longitude: 106.9212, ponPort: "PON 1/2", splitters: 1, portsUsed: 8, totalPorts: 8, signalLevel: -18.4 },
  ],
  "olt-4": [
    { id: "odp-4-1", name: "ODP-KLAP-A-001", latitude: -6.5231, longitude: 107.0123, ponPort: "PON 1/1", splitters: 2, portsUsed: 15, totalPorts: 16, signalLevel: -17.9 },
    { id: "odp-4-2", name: "ODP-KLAP-B-001", latitude: -6.5255, longitude: 107.0145, ponPort: "PON 1/2", splitters: 1, portsUsed: 6, totalPorts: 8, signalLevel: -23.5 },
  ],
  "olt-pandeglang-1": [
    { id: "odp-lbn-1", name: "ODP-LBN-42260-30-001", latitude: -6.38833, longitude: 105.83925, ponPort: "PON 1/1", splitters: 2, portsUsed: 8,  totalPorts: 16, signalLevel: -19.0 },
    { id: "odp-lbn-2", name: "ODP-LBN-42264-30-010", latitude: -6.38916, longitude: 105.83778, ponPort: "PON 1/1", splitters: 1, portsUsed: 5,  totalPorts: 8,  signalLevel: -21.4 },
    { id: "odp-lbn-3", name: "ODP-LBN-42264-30-021", latitude: -6.38661, longitude: 105.83756, ponPort: "PON 1/2", splitters: 2, portsUsed: 12, totalPorts: 16, signalLevel: -20.1 },
    { id: "odp-lbn-4", name: "ODP-LBN-42264-30-028", latitude: -6.38617, longitude: 105.84033, ponPort: "PON 1/2", splitters: 1, portsUsed: 6,  totalPorts: 8,  signalLevel: -22.7 },
    { id: "odp-lbn-5", name: "ODP-LBN-42265-30-017", latitude: -6.39086, longitude: 105.83911, ponPort: "PON 1/3", splitters: 2, portsUsed: 10, totalPorts: 16, signalLevel: -18.6 },
  ],
};
