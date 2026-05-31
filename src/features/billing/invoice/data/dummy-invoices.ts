import { InvoiceItem } from "../types";

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

const statuses: InvoiceItem["status"][] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "partial",
  "cancelled",
];
const types: InvoiceItem["type"][] = ["otc", "recurring", "addon"];

function generateInvoiceNumber(index: number): string {
  return `INV-2026-${String(index).padStart(5, "0")}`;
}

function generateFakturPajak(index: number): string {
  return `010.000-${String(index).padStart(3, "0")}.2026.${String(index).padStart(8, "0")}`;
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

function randomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const dummyInvoices: InvoiceItem[] = Array.from(
  { length: 50 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const type = types[i % types.length];
    const branch = branches[i % branches.length];
    const subtotal =
      type === "otc"
        ? randomAmount(100000, 500000)
        : type === "recurring"
          ? randomAmount(200000, 1500000)
          : randomAmount(50000, 300000);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    return {
      id: `INV-${String(i + 1).padStart(3, "0")}`,
      invoiceNumber: generateInvoiceNumber(i + 1),
      customerId: customer.id,
      customerName: customer.name,
      customerType: customer.type,
      type,
      status,
      subtotal,
      tax,
      total,
      dueDate: randomDate(new Date("2026-01-01"), new Date("2026-12-31")),
      issuedDate: randomDate(new Date("2025-12-01"), new Date("2026-06-01")),
      paidDate:
        status === "paid"
          ? randomDate(new Date("2026-01-01"), new Date("2026-06-01"))
          : undefined,
      fakturPajakNumber:
        status === "paid" ? generateFakturPajak(i + 1) : undefined,
      billingSchemaVersion: customer.type === "broadband" ? "v1.0" : "v2.0",
      branch,
      notes: i % 3 === 0 ? "First billing cycle" : undefined,
      lineItems: [
        {
          id: `LI-${i + 1}-1`,
          description:
            type === "otc"
              ? "One-Time Charge - Installation"
              : type === "recurring"
                ? `Monthly Service - ${customer.type === "broadband" ? "50 Mbps" : "100 Mbps"}`
                : "Speed Boost Add-on",
          quantity: 1,
          unitPrice: subtotal,
          subtotal,
        },
      ],
      createdAt: randomDate(new Date("2025-12-01"), new Date("2026-06-01")),
      updatedAt: randomDate(new Date("2026-01-01"), new Date("2026-06-01")),
    };
  }
);
