export type DuplicateStatus = "pending" | "merged" | "dismissed" | "deferred";
export type MatchReason = "name" | "phone" | "email" | "address" | "location";
export type MergeAction = "merge" | "dismiss" | "defer";

export interface DuplicateLeadSnapshot {
  id: string;
  lead_name: string;
  lead_type: "broadband" | "enterprise";
  customer_sub_type: "residential" | "business";
  source: string;
  status: string;
  branch_id: string;
  branch_name: string;
  assigned_sales_name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
}

export interface DuplicatePair {
  id: string;
  leadA: DuplicateLeadSnapshot;
  leadB: DuplicateLeadSnapshot;
  similarityScore: number;
  matchReasons: MatchReason[];
  status: DuplicateStatus;
  masterId?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  detectedAt: string;
}
