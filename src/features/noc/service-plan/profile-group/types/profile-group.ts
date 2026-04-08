import { z } from "zod";

export const profileGroupSchema = z.object({
  groupName: z.string().min(1, "Profile group name is required"),
  dataOwner: z.string().min(1, "Data owner is required"),
  routersNas: z.string().min(1, "Router is required"),
  type: z.string().min(1, "Type is required"),
  ipPoolModule: z.string().min(1, "IP pool module is required"),
  dnsServer: z.string().min(1, "DNS server is required"),
  parentQueue: z.string().optional(),
});

export type ProfileGroupFormValues = z.infer<typeof profileGroupSchema>;
export const DEFAULT_PROFILE_GROUP_VALUES: ProfileGroupFormValues = {
  groupName: "",
  dataOwner: "",
  routersNas: "",
  type: "HOTSPOT",
  ipPoolModule: "GROUP ONLY ( FOR HOTSPOT ONLY )",
  dnsServer: "",
  parentQueue: "",
};

export const MOCK_PROFILE_GROUP_VALUES: ProfileGroupFormValues = {
  groupName: "Premium Home",
  dataOwner: "Sales Retail",
  routersNas: "MikroTik-Bengkulu",
  type: "HOTSPOT",
  ipPoolModule: "GROUP ONLY ( FOR HOTSPOT ONLY )",
  dnsServer: "8.8.8.8, 8.8.4.4",
  parentQueue: "Standard-Queue",
};

export interface ProfileGroupData {
  id: string;
  groupName: string;
  type: string;
  parentPool: string;
  module: string;
  localAddress: string;
  firstAddress: string;
  lastAddress: string;
  routersNas: string;
  dataOwner: string;
  lastChecked: string;
  // Form fields (optional for table compatibility)
  ipPoolModule?: string;
  dnsServer?: string;
  parentQueue?: string;
}



