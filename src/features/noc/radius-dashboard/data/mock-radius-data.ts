import { RadiusKpi, RadiusSessionTrend, AuthStats, NasPerformance, RadiusLog, RadiusServiceInfo, NocSummary, NocTopologyStatus } from "../types/radius-dashboard";
import { subHours, format, subDays, startOfDay } from "date-fns";

// Optimized mock data generator for Radius Dashboard
export const RADIUS_KPI: RadiusKpi = {
  totalSessions: 142582,
  activeUsers: 85240,
  authSuccessRate: 98.4,
  totalTraffic: "842.5 TB",
  trend: {
    sessions: 12.5,
    users: 8.2
  }
};

// Generate 24 hours of session trends
export const RADIUS_SESSION_TRENDS: RadiusSessionTrend[] = Array.from({ length: 24 }).map((_, i) => ({
  timestamp: format(subHours(new Date(), 23 - i), 'HH:00'),
  count: Math.floor(Math.random() * 20000) + 60000
}));

export const RADIUS_AUTH_STATS: AuthStats[] = [
  { status: 'success', count: 125420, percentage: 88 },
  { status: 'failed', count: 12450, percentage: 8.7 },
  { status: 'reject', count: 3200, percentage: 2.2 },
  { status: 'timeout', count: 1540, percentage: 1.1 }
];

export const NAS_PERFORMANCE: NasPerformance[] = [
  { nasName: "NAS-JAKARTA-01", ipAddress: "10.0.0.1", activeSessions: 42500, cpuUsage: 45, memoryUsage: 62, trafficDown: "125 TB", trafficUp: "45 TB" },
  { nasName: "NAS-SURABAYA-01", ipAddress: "10.0.0.2", activeSessions: 31200, cpuUsage: 38, memoryUsage: 55, trafficDown: "98 TB", trafficUp: "32 TB" },
  { nasName: "NAS-BANDUNG-01", ipAddress: "10.0.0.3", activeSessions: 28400, cpuUsage: 52, memoryUsage: 70, trafficDown: "85 TB", trafficUp: "28 TB" },
  { nasName: "NAS-MEDAN-01", ipAddress: "10.0.0.4", activeSessions: 15600, cpuUsage: 25, memoryUsage: 42, trafficDown: "42 TB", trafficUp: "15 TB" },
  { nasName: "NAS-MAKASSAR-01", ipAddress: "10.0.0.5", activeSessions: 12400, cpuUsage: 22, memoryUsage: 38, trafficDown: "38 TB", trafficUp: "12 TB" },
];

// Generate large set of logs for high-performance table testing
export const RADIUS_LOGS: RadiusLog[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `log-${i}`,
  username: `user_${Math.floor(Math.random() * 10000)}@ion`,
  nasIp: `10.0.0.${Math.floor(Math.random() * 5) + 1}`,
  nasPort: `${Math.floor(Math.random() * 1000) + 1000}`,
  serviceType: 'Framed-User',
  status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'failed' : 'reject'),
  timestamp: format(subHours(new Date(), Math.random() * 48), 'yyyy-MM-dd HH:mm:ss'),
  callingStationId: `00:1A:2B:3C:4D:${(i % 255).toString(16).padStart(2, '0').toUpperCase()}`,
  reason: Math.random() > 0.9 ? 'Incorrect Password' : undefined
}));

export const RADIUS_SERVICE_INFO: RadiusServiceInfo = {
  status: "active",
  uptime: "14 Days, 8 Hours, 22 Minutes",
  totalNas: 12,
  totalCustomers: 85240,
  totalBandwidths: 24,
  totalProfileGroups: 8
};

export const NOC_SUMMARY: NocSummary = {
  total_warnings: 0,
  open_warnings: 0,
  total_incidents: 0,
  open_incidents: 0,
  down_nodes: 0,
  high_utilization_ports: 0,
  flapping_subscribers: 0
};

export const NOC_TOPOLOGY_STATUS: NocTopologyStatus = {
  pops: {
    DEGRADED: 0,
    DOWN: 0,
    UNKNOWN: 2,
    UP: 0
  },
  olts: {
    DEGRADED: 0,
    DOWN: 0,
    UNKNOWN: 8,
    UP: 0
  },
  odps: {
    DEGRADED: 0,
    DOWN: 0,
    UNKNOWN: 47,
    UP: 0
  },
  links: {
    DEGRADED: 0,
    DOWN: 0,
    UNKNOWN: 0,
    UP: 0
  }
};

export const GATE_ALERTS: import("../types/radius-dashboard").GateAlert[] = [
  {
    id: "alert-1",
    workOrderId: "53f15fa4-1fc7-4bcf-98fd-bcc5384c3523",
    workOrderNumber: "WO-20260507-644",
    technicianName: "Budi Santoso",
    status: "EXPIRED",
    expiredAt: format(subHours(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
    message: "Temporary Radius window expired. No BAST received.",
  },
  {
    id: "alert-2",
    workOrderId: "efe6f4cb-2d1a-407d-aec6-bf291fd49000",
    workOrderNumber: "WO-20260507-358",
    technicianName: "Agus Pratama",
    status: "REVOKED",
    expiredAt: format(subHours(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
    message: "Radius revoked due to WO cancellation.",
  }
];

export const RETRY_QUEUE: import("../types/radius-dashboard").RetryQueueItem[] = [
  {
    id: "retry-1",
    workOrderId: "19e0437-e10f-78f0-b714-bfc22a716beb",
    workOrderNumber: "WO-20260508-012",
    technicianName: "Dedi Setiawan",
    status: "TEMPORARY_PENDING",
    attempts: 3,
    lastAttemptAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    errorMessage: "RADIUS server timeout (5xx). Queued for retry.",
  }
];
