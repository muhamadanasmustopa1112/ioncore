import type { WoType, WoStatus, WoPriority } from "./work-order-api";

export type { WoType, WoStatus, WoPriority };

export interface ChecklistItem {
  id: string;
  checklistId: string;
  templateItemId: string | null;
  itemName: string;
  description: string;
  orderNumber: number;
  isRequired: boolean;
  isChecked: boolean;
  notes: string;
  checkedAt: string | null;
  checkedBy: string | null;
}

export interface Checklist {
  id: string;
  workOrderId: string;
  templateId: string | null;
  name: string;
  items: ChecklistItem[];
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  title: string;
  description: string;
  type: WoType;
  status: WoStatus;
  priority: WoPriority;
  customerId: string;
  customerName: string;
  serviceAddress: string;
  branchId: string;
  technicianId: string | null;
  technicianName: string | null;
  notes: string;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  checklists: Checklist[];
}

export const WO_TYPE_LABELS: Record<WoType, string> = {
  ISP_INSTALLATION: "Installation",
  ISP_MAINTENANCE: "Maintenance",
  ISP_RELOCATION: "Relocation",
  ISP_TERMINATION: "Termination",
};

export const WO_STATUS_LABELS: Record<WoStatus, string> = {
  CREATED: "Created",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const WO_STATUS_VARIANTS: Record<WoStatus, "secondary" | "warning" | "success"> = {
  CREATED: "secondary",
  IN_PROGRESS: "warning",
  DONE: "success",
};

export const WO_PRIORITY_LABELS: Record<WoPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const WO_PRIORITY_VARIANTS: Record<WoPriority, "secondary" | "info" | "destructive"> = {
  LOW: "secondary",
  MEDIUM: "info",
  HIGH: "destructive",
};
