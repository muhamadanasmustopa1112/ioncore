import { BandwidthItem } from "../types/bandwidth";

export const DUMMY_BANDWIDTH: BandwidthItem[] = [
  {
    id: 1,
    type: "SME",
    code: "SME-50M",
    group_name: "SME",
    name: "SME Starter 50M",
    data_owner: "radius_admin",
    rate_limit: "50M/50M",
    download_mbps: 50,
    upload_mbps: 50,
    min_rate_up: 10,
    min_rate_up_unit: "Mbps",
    max_rate_up: 50,
    max_rate_up_unit: "Mbps",
    min_rate_down: 10,
    min_rate_down_unit: "Mbps",
    max_rate_down: 50,
    max_rate_down_unit: "Mbps",
    upload_display: "10-50 Mbps",
    download_display: "10-50 Mbps",
    attributes: {
      service_profile: "business"
    }
  },
  {
    id: 2,
    type: "Corporate",
    code: "COR-100M",
    group_name: "Corporate",
    name: "Corporate Gold 100M",
    data_owner: "radius_admin",
    rate_limit: "100M/100M",
    download_mbps: 100,
    upload_mbps: 100,
    min_rate_up: 100,
    min_rate_up_unit: "Mbps",
    max_rate_up: 100,
    max_rate_up_unit: "Mbps",
    min_rate_down: 100,
    min_rate_down_unit: "Mbps",
    max_rate_down: 100,
    max_rate_down_unit: "Mbps",
    upload_display: "100 Mbps",
    download_display: "100 Mbps",
    attributes: {
      service_profile: "enterprise"
    }
  },
  {
    id: 3,
    type: "Residential",
    code: "RES-20M",
    group_name: "Residential",
    name: "Home Play 20M",
    data_owner: "radius_admin",
    rate_limit: "20M/20M",
    download_mbps: 20,
    upload_mbps: 10,
    min_rate_up: 5,
    min_rate_up_unit: "Mbps",
    max_rate_up: 10,
    max_rate_up_unit: "Mbps",
    min_rate_down: 10,
    min_rate_down_unit: "Mbps",
    max_rate_down: 20,
    max_rate_down_unit: "Mbps",
    upload_display: "5-10 Mbps",
    download_display: "10-20 Mbps",
    attributes: {
      service_profile: "residential"
    }
  },
];
