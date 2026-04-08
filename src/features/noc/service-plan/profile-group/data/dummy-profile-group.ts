import { ProfileGroupData } from "../types";


export const DUMMY_PROFILE_GROUP: ProfileGroupData[] = [
  {
    id: "pg1",
    groupName: "Premium Home",
    type: "Dynamic",
    parentPool: "Pool A",
    module: "Module 1",
    localAddress: "192.168.1.1",
    firstAddress: "192.168.1.10",
    lastAddress: "192.168.1.100",
    routersNas: "MikroTik-Bengkulu",
    dataOwner: "Sales Retail",
    lastChecked: new Date().toISOString(),
  },
  {
    id: "pg2",
    groupName: "Business Pro",
    type: "Static",
    parentPool: "Pool B",
    module: "Module 2",
    localAddress: "172.16.0.1",
    firstAddress: "172.16.0.10",
    lastAddress: "172.16.0.250",
    routersNas: "Cisco-Jakarta",
    dataOwner: "Enterprise Solutions",
    lastChecked: new Date().toISOString(),
  },
  {
    id: "pg3",
    groupName: "Dedicated Local",
    type: "Static",
    parentPool: "Core Pool",
    module: "Core Module",
    localAddress: "10.0.0.1",
    firstAddress: "10.0.10.1",
    lastAddress: "10.0.10.254",
    routersNas: "Juniper-NOC",
    dataOwner: "NOC Infrastructure",
    lastChecked: new Date().toISOString(),
  },
];

