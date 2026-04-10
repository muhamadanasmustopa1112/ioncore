import { PPPProfileData } from "../types";


export const DUMMY_PPP_PROFILE: PPPProfileData[] = [
  {
    id: "bw1",
    name: "Platinum Plus 15M",
    planeName: "PLATINUM PLUS Up to 15 MB",
    profileGroup: "PLATINUM",
    bandwidth: "15M",
    capitalPrice: 350000,
    sellPrice: 400000,
    promoPrice: 390000,
    vat: 11,
    planValidity: 30,
    timeUnit: "DAYS",
    sharedUsers: 1,
    priority: 1,
    loginPeriod: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
    fromTime: "00:00",
    toTime: "23:59",
    sharedUser: "Single Device",
    dataOwner: "radius_admin",
    vcrCustomer: "10",
  },
];
