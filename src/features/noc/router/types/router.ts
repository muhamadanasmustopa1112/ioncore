export interface RouterData {
  id: string;
  pingStatus: "online" | "offline" | "warning";
  routerName: string;
  ipAddress: string;
  timeZone: string;
  description: string;
  onlineUsers: number;
  lastChecked: string;
}
