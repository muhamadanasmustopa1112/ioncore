import { CommissionItem } from "../types";

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

const salesReps = [
  { id: "SR-001", name: "Andi Pratama" },
  { id: "SR-002", name: "Rina Wulandari" },
  { id: "SR-003", name: "Dedi Kurniawan" },
  { id: "SR-004", name: "Lestari Putri" },
  { id: "SR-005", name: "Hendra Wijaya" },
  { id: "SR-006", name: "Maya Sari" },
  { id: "SR-007", name: "Budi Santoso" },
  { id: "SR-008", name: "Dewi Anggraini" },
  { id: "SR-009", name: "Fajar Nugroho" },
  { id: "SR-010", name: "Siti Rahayu" },
];

const customers = [
  { id: "CUST-001", name: "PT Maju Bersama", type: "business" as const },
  { id: "CUST-002", name: "Budi Hartono", type: "broadband" as const },
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
  { id: "CUST-014", name: "Joko Susanto", type: "broadband" as const },
  { id: "CUST-015", name: "PT Samudra Net", type: "business" as const },
];

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

function randomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const splitPresets: CommissionItem["split"][] = [
  { salesPerson: 55, salesManager: 5, salesBranch: 15, infraBranch: 10, company: 15 },
  { salesPerson: 50, salesManager: 7, salesBranch: 18, infraBranch: 10, company: 15 },
  { salesPerson: 60, salesManager: 5, salesBranch: 12, infraBranch: 8, company: 15 },
  { salesPerson: 45, salesManager: 10, salesBranch: 15, infraBranch: 12, company: 18 },
  { salesPerson: 52, salesManager: 6, salesBranch: 16, infraBranch: 11, company: 15 },
  { salesPerson: 48, salesManager: 8, salesBranch: 14, infraBranch: 12, company: 18 },
];

export const dummyCommissions: CommissionItem[] = Array.from(
  { length: 30 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const salesRep = salesReps[i % salesReps.length];
    const branch = branches[i % branches.length];
    const split = splitPresets[i % splitPresets.length];
    const totalAmount = randomAmount(500000, 15000000);
    const status: CommissionItem["status"] = i % 3 === 0 ? "paid" : "pending";
    const triggerDate = randomDate(new Date("2026-01-01"), new Date("2026-06-01"));

    return {
      id: `COM-${String(i + 1).padStart(3, "0")}`,
      commissionNumber: `COM-2026-${String(i + 1).padStart(5, "0")}`,
      salesRepId: salesRep.id,
      salesRepName: salesRep.name,
      customerId: customer.id,
      customerName: customer.name,
      invoiceNumber: `INV-2026-${String((i % 15) + 1).padStart(5, "0")}`,
      totalAmount,
      split,
      status,
      triggerDate,
      paidDate:
        status === "paid"
          ? randomDate(new Date("2026-02-01"), new Date("2026-06-01"))
          : undefined,
      customerType: customer.type,
      branch,
      createdAt: triggerDate,
    };
  }
);
