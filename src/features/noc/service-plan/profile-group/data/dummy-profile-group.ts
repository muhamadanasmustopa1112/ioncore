import { ProfileGroupData } from "../types";

export const DUMMY_PROFILE_GROUP: ProfileGroupData[] = [
  {
    id: 1,
    group_name: "Premium Home",
    name: "Premium Home",
    type: "Dynamic",
    profile_type: "PPP",
    parent_pool: "Pool A",
    module: "Module 1",
    local_address: "192.168.1.1",
    first_address: "192.168.1.10",
    last_address: "192.168.1.100",
    router_nas: "MikroTik-Bengkulu",
    data_owner: "Sales Retail",
    code: "PG-PREM",
  },
  {
    id: 2,
    group_name: "Business Pro",
    name: "Business Pro",
    type: "Static",
    profile_type: "PPP",
    parent_pool: "Pool B",
    module: "Module 2",
    local_address: "172.16.0.1",
    first_address: "172.16.0.10",
    last_address: "172.16.0.250",
    router_nas: "Cisco-Jakarta",
    data_owner: "Enterprise Solutions",
    code: "PG-BUS",
  },
];
