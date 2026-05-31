import { PaymentItem } from "../types";

const customers = [
  { id: "CUST-001", name: "PT Maju Bersama" },
  { id: "CUST-002", name: "Budi Santoso" },
  { id: "CUST-003", name: "CV Teknologi Nusantara" },
  { id: "CUST-004", name: "Siti Rahayu" },
  { id: "CUST-005", name: "PT Global Solusi" },
  { id: "CUST-006", name: "Ahmad Hidayat" },
  { id: "CUST-007", name: "PT Sentosa Jaya" },
  { id: "CUST-008", name: "Dewi Lestari" },
  { id: "CUST-009", name: "PT Cahaya Digital" },
  { id: "CUST-010", name: "Rudi Hermawan" },
  { id: "CUST-011", name: "PT Bintang Timur" },
  { id: "CUST-012", name: "Maya Putri" },
  { id: "CUST-013", name: "PT Nusantara Fiber" },
  { id: "CUST-014", name: "Joko Widodo" },
  { id: "CUST-015", name: "PT Samudra Net" },
];

const statuses: PaymentItem["status"][] = ["pending", "confirmed", "failed"];
const methods: PaymentItem["method"][] = [
  "bank_transfer",
  "e_wallet",
  "credit_card",
  "convenience_store",
];

const confirmers = [
  "Admin Finance",
  "Finance Manager",
  "Branch Manager",
  "System Auto-Confirm",
  "Supervisor",
];

function generatePaymentNumber(index: number): string {
  return `PAY-2026-${String(index).padStart(5, "0")}`;
}

function generateInvoiceNumber(index: number): string {
  return `INV-2026-${String(index).padStart(5, "0")}`;
}

function generateReference(method: PaymentItem["method"], index: number): string {
  switch (method) {
    case "bank_transfer":
      return `TRF${String(index).padStart(10, "0")}`;
    case "e_wallet":
      return `EW${String(index).padStart(12, "0")}`;
    case "credit_card":
      return `CC${String(index).padStart(8, "0")}`;
    case "convenience_store":
      return `CSV${String(index).padStart(10, "0")}`;
  }
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

export const dummyPayments: PaymentItem[] = Array.from(
  { length: 40 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const method = methods[i % methods.length];

    return {
      id: `PAY-${String(i + 1).padStart(3, "0")}`,
      paymentNumber: generatePaymentNumber(i + 1),
      invoiceNumber: generateInvoiceNumber(i + 1),
      customerId: customer.id,
      customerName: customer.name,
      amount: randomAmount(150000, 5000000),
      method,
      status,
      paidDate: randomDate(new Date("2026-01-01"), new Date("2026-06-01")),
      confirmedBy:
        status === "confirmed"
          ? confirmers[i % confirmers.length]
          : undefined,
      referenceNumber: generateReference(method, i + 1),
      createdAt: randomDate(new Date("2025-12-01"), new Date("2026-06-01")),
    };
  }
);
