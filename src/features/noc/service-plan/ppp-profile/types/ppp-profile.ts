export type TimeUnit = "MINUTES" | "HOURS" | "DAYS" | "WEEKS" | "MONTHS";

export interface PPPProfileData {
  id: string;
  name: string;
  planeName: string;
  dataOwner: string;
  capitalPrice: number;
  sellPrice: number;
  promoPrice: number;
  vat: number;
  profileGroup: string;
  bandwidth: string;
  planValidity: number; // 0 for Unlimited
  timeUnit: TimeUnit;
  sharedUsers: number;
  priority: number;
  loginPeriod: string[]; // ["MONDAY", "TUESDAY", ...]
  fromTime: string; // HH:mm
  toTime: string; // HH:mm
  vcrCustomer?: string;
  sharedUser?: string;
}

export type PPPProfileFormValues = Omit<PPPProfileData, "id">;
