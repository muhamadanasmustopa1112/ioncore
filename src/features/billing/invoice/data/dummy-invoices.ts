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
  { id: "CUST-016", name: "PT Enterprise Mega Corp", type: "enterprise" as const },
  { id: "CUST-017", name: "Corporate Holdings Ltd", type: "corporate" as const },
  { id: "CUST-018", name: "Enterprise Solutions Inc", type: "enterprise" as const },
  { id: "CUST-019", name: "PT Corporate Indonesia", type: "corporate" as const },
  { id: "CUST-020", name: "Hendra Gunawan", type: "broadband" as const },
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

const schemaMap: Record<string, { id: string; name: string; version: string; rules: InvoiceItem["appliedSchemaRules"] }> = {
  broadband: {
    id: "schema-ver-bb-v12",
    name: "Broadband Monthly Standard",
    version: "v1.2",
    rules: {
      otcType: "prepaid",
      gracePeriodDays: 7,
      lateFee: { type: "percentage" as const, value: 2 },
      taxRate: 11,
      paymentMethods: ["bank_transfer", "e_wallet", "credit_card", "convenience_store"],
    },
  },
  business: {
    id: "schema-ver-biz-v20",
    name: "Business Monthly Standard",
    version: "v2.0",
    rules: {
      otcType: "prepaid",
      gracePeriodDays: 15,
      lateFee: { type: "percentage" as const, value: 1.5 },
      taxRate: 11,
      paymentMethods: ["bank_transfer", "e_wallet", "credit_card"],
    },
  },
  enterprise: {
    id: "schema-ver-ent-v10",
    name: "Enterprise Quarterly",
    version: "v1.0",
    rules: {
      otcType: "postpaid",
      gracePeriodDays: 30,
      lateFee: { type: "fixed" as const, value: 50000 },
      taxRate: 11,
      paymentMethods: ["bank_transfer", "credit_card"],
    },
  },
  corporate: {
    id: "schema-ver-corp-v10",
    name: "Corporate Annual Custom",
    version: "v1.0",
    rules: {
      otcType: "postpaid",
      gracePeriodDays: 45,
      lateFee: undefined,
      taxRate: 11,
      paymentMethods: ["bank_transfer", "credit_card"],
    },
  },
};

export const dummyInvoices: InvoiceItem[] = Array.from(
  { length: 50 },
  (_, i) => {
    const customer = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const type = types[i % types.length];
    const branch = branches[i % branches.length];
    const schema = schemaMap[customer.type];
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
      billingSchemaVersionId: schema.id,
      billingSchemaName: schema.name,
      billingSchemaVersion: schema.version,
      appliedSchemaRules: schema.rules,
      branch,
      notes: i % 3 === 0 ? "First billing cycle" : undefined,
      lineItems: [
        {
          id: `LI-${i + 1}-1`,
          description:
            type === "otc"
              ? "One-Time Charge - Installation"
              : type === "recurring"
                ? `Monthly Service - ${customer.type === "broadband" ? "50 Mbps" : customer.type === "business" ? "100 Mbps" : customer.type === "enterprise" ? "500 Mbps Dedicated" : "Custom Enterprise"}`
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
