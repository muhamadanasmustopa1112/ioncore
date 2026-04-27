export type RadiusStatus = 'success' | 'failed' | 'timeout' | 'reject';

export interface RadiusKpi {
  totalSessions: number;
  activeUsers: number;
  authSuccessRate: number;
  totalTraffic: string; // e.g. "4.2 TB"
  trend: {
    sessions: number; // percentage
    users: number; // percentage
  };
}

export interface RadiusSessionTrend {
  timestamp: string;
  count: number;
}

export interface AuthStats {
  status: RadiusStatus;
  count: number;
  percentage: number;
}

export interface NasPerformance {
  nasName: string;
  ipAddress: string;
  activeSessions: number;
  cpuUsage: number;
  memoryUsage: number;
  trafficDown: string;
  trafficUp: string;
}

export interface RadiusLog {
  id: string;
  username: string;
  nasIp: string;
  nasPort: string;
  serviceType: string;
  status: RadiusStatus;
  timestamp: string;
  reason?: string;
  callingStationId: string; // MAC or Phone
}

export interface RadiusDashboardFilters {
  dateRange: [Date, Date] | null;
  nasIp?: string;
  status?: RadiusStatus | 'all';
  searchQuery?: string;
}

export interface RadiusServiceInfo {
  status: "active" | "inactive" | "maintenance";
  uptime: string;
  totalNas: number;
  totalCustomers: number;
  totalBandwidths: number;
  totalProfileGroups: number;
}

export interface NocSummary {
  total_warnings: number;
  open_warnings: number;
  total_incidents: number;
  open_incidents: number;
  down_nodes: number;
  high_utilization_ports: number;
  flapping_subscribers: number;
}

export interface TopologyStats {
  DEGRADED: number;
  DOWN: number;
  UNKNOWN: number;
  UP: number;
}

export interface NocTopologyStatus {
  pops: TopologyStats;
  olts: TopologyStats;
  odps: TopologyStats;
  links: TopologyStats;
}
