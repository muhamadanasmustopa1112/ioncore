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

export const dummySuspensions: SuspensionItem[] = Array.from(
  { length: 20 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const branch = branches[i % branches.length];
    const overdueDays = Math.floor(Math.random() * 60) + 15;

    return {
      id: `SUS-${String(i + 1).padStart(3, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type,
      invoiceNumber: generateInvoiceNumber(i + 1),
      overdueDays,
      status,
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
          ? "Admin System"
          : undefined,
      reason: reasons[i % reasons.length],
      branch,
      createdAt: randomDate(new Date("2025-12-01"), new Date("2026-06-01")),
    };
  }
);
