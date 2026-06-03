import { SuspensionItem } from "../types";

const branches = [
  "Jakarta Selatan",
  "Jakarta Barat",
  "Jakarta Timur",
  "Bandung Utara",
  "Bandung Selatan",
  "Surabaya Pusat",
  "Surabaya Barat",
  "Semarang",
  "Yogyakarta",
  "Medan",
];

const customers = [
  { id: "CUST-001", name: "PT Maju Bersama", type: "business" as const },
  { id: "CUST-002", name: "Budi Santoso", type: "broadband" as const },
  { id: "CUST-003", name: "CV Teknologi Nusantara", type: "business" as const },
  { id: "CUST-004", name: "Siti Rahayu", type: "broadband" as const },
  { id: "CUST-005", name: "PT Global Solusi", type: "business" as const },
  { id: "CUST-006", name: "Ahmad Hidayat", type: "broadband" as const },
  { id: "CUST-007", name: "PT Sentosa Jaya", type: "business" as const },
  { id: "CUST-008", name: "Dewi Lestari", type: "broadband" as const },
  { id: "CUST-009", name: "PT Cahaya Digital", type: "business" as const },
  { id: "CUST-010", name: "Rudi Hermawan", type: "broadband" as const },
  { id: "CUST-011", name: "PT Bintang Timur", type: "business" as const },
  { id: "CUST-012", name: "Maya Putri", type: "broadband" as const },
  { id: "CUST-013", name: "PT Nusantara Fiber", type: "business" as const },
  { id: "CUST-014", name: "Joko Widodo", type: "broadband" as const },
  { id: "CUST-015", name: "PT Samudra Net", type: "business" as const },
  { id: "CUST-016", name: "PT Enterprise Mega Corp", type: "enterprise" as const },
  { id: "CUST-017", name: "Corporate Holdings Ltd", type: "corporate" as const },
  { id: "CUST-018", name: "Enterprise Solutions Inc", type: "enterprise" as const },
  { id: "CUST-019", name: "PT Corporate Indonesia", type: "corporate" as const },
  { id: "CUST-020", name: "Hendra Gunawan", type: "broadband" as const },
];

const statuses: SuspensionItem["status"][] = [
  "pending",
  "approved",
  "suspended",
  "restored",
];

const reasons = [
  "Invoice overdue more than 30 days",
  "Multiple unpaid invoices",
  "Payment bounced",
  "Customer request",
  "Non-compliance with terms",
];

function generateInvoiceNumber(index: number): string {
  return `INV-2026-${String(index).padStart(5, "0")}`;
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

const suspensionSchemaMap: Record<string, { id: string; name: string; version: string; rules: SuspensionItem["appliedSchemaRules"] }> = {
  broadband: {
    id: "schema-ver-susp-bb-v10",
    name: "Broadband Auto-Suspend",
    version: "v1.0",
    rules: {
      autoSuspend: true,
      requiresApproval: false,
      requiresExecutiveApproval: false,
      ionRadiusAction: "full_block",
    },
  },
  business: {
    id: "schema-ver-susp-biz-v10",
    name: "Business Manual Approval",
    version: "v1.0",
    rules: {
      autoSuspend: false,
      requiresApproval: true,
      requiresExecutiveApproval: false,
      ionRadiusAction: "full_block",
    },
  },
  enterprise: {
    id: "schema-ver-susp-ent-v10",
    name: "Enterprise Finance Manager Approval",
    version: "v1.0",
    rules: {
      autoSuspend: false,
      requiresApproval: true,
      requiresExecutiveApproval: false,
      ionRadiusAction: "full_block",
    },
  },
  corporate: {
    id: "schema-ver-susp-corp-v10",
    name: "Corporate Executive Approval",
    version: "v1.0",
    rules: {
      autoSuspend: false,
      requiresApproval: true,
      requiresExecutiveApproval: true,
      ionRadiusAction: "throttle",
      throttleSpeedKbps: 64,
    },
  },
};

export const dummySuspensions: SuspensionItem[] = Array.from(
  { length: 20 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const branch = branches[i % branches.length];
    const schema = suspensionSchemaMap[customer.type];
    const overdueDays = Math.floor(Math.random() * 60) + 15;

    const approvalChain: SuspensionItem["approvalChain"] = customer.type === "corporate"
      ? [
          { role: "Finance Manager", approver: status !== "pending" ? "FinanceMgr-01" : undefined, status: status === "pending" ? "pending" : "approved" },
          { role: "Executive", approver: status === "suspended" || status === "restored" ? "Exec-01" : undefined, status: status === "pending" || status === "approved" ? "pending" : "approved" },
        ]
      : customer.type === "business" || customer.type === "enterprise"
        ? [
            { role: "Finance Manager", approver: status !== "pending" ? "FinanceMgr-01" : undefined, status: status === "pending" ? "pending" : "approved" },
          ]
        : undefined;

    return {
      id: `SUS-${String(i + 1).padStart(3, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type,
      invoiceNumber: generateInvoiceNumber(i + 1),
      overdueDays,
      status,
      suspensionSchemaVersionId: schema.id,
      suspensionSchemaName: schema.name,
      suspensionSchemaVersion: schema.version,
      appliedSchemaRules: schema.rules,
      approvalChain,
      suspensionDate:
        status === "suspended" || status === "restored"
          ? randomDate(new Date("2026-01-01"), new Date("2026-06-01"))
          : undefined,
      restoredDate:
        status === "restored"
          ? randomDate(new Date("2026-03-01"), new Date("2026-06-01"))
          : undefined,
      approvedBy:
        status === "approved" || status === "suspended" || status === "restored"
          ? "FinanceMgr-01"
          : undefined,
      restoredBy:
        status === "restored"
          ? customer.type === "corporate" ? "Exec-01" : "FinanceMgr-01"
          : undefined,
      reason: reasons[i % reasons.length],
      branch,
      createdAt: randomDate(new Date("2025-12-01"), new Date("2026-06-01")),
    };
  }
);
