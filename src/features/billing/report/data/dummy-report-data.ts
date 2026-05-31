import type {
  MonthlyRevenue,
  ArAgingBucket,
  RevenueByType,
  RevenueByBranch,
  WeeklySuspension,
  CommissionSummary,
  InvoiceRegisterRow,
  ArAgingDetailRow,
  FakturPajakRow,
  SuspensionListRow,
  CommissionDetailRow,
} from "../types";

export const dummyMonthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan", mrr: 210000000, otc: 45000000, total: 255000000 },
  { month: "Feb", mrr: 215000000, otc: 52000000, total: 267000000 },
  { month: "Mar", mrr: 220000000, otc: 48000000, total: 268000000 },
  { month: "Apr", mrr: 225000000, otc: 55000000, total: 280000000 },
  { month: "May", mrr: 228000000, otc: 60000000, total: 288000000 },
  { month: "Jun", mrr: 232000000, otc: 58000000, total: 290000000 },
  { month: "Jul", mrr: 235000000, otc: 62000000, total: 297000000 },
  { month: "Aug", mrr: 238000000, otc: 65000000, total: 303000000 },
  { month: "Sep", mrr: 240000000, otc: 59000000, total: 299000000 },
  { month: "Oct", mrr: 242000000, otc: 68000000, total: 310000000 },
  { month: "Nov", mrr: 244000000, otc: 70000000, total: 314000000 },
  { month: "Dec", mrr: 245500000, otc: 67300000, total: 312800000 },
];

export const dummyArAging: ArAgingBucket[] = [
  { bucket: "Current", count: 1250, amount: 320000000 },
  { bucket: "1-7 days", count: 180, amount: 45000000 },
  { bucket: "8-14 days", count: 95, amount: 28000000 },
  { bucket: "15-30 days", count: 62, amount: 18500000 },
  { bucket: "30+ days", count: 38, amount: 12800000 },
];

export const dummyRevenueByType: RevenueByType[] = [
  { name: "Broadband", value: 218000000, fill: "hsl(var(--primary))" },
  { name: "Business", value: 94800000, fill: "hsl(var(--chart-2))" },
];

export const dummyRevenueByBranch: RevenueByBranch[] = [
  { branch: "Jakarta Pusat", revenue: 58000000 },
  { branch: "Jakarta Selatan", revenue: 52000000 },
  { branch: "Bandung", revenue: 45000000 },
  { branch: "Surabaya", revenue: 42000000 },
  { branch: "Medan", revenue: 38000000 },
  { branch: "Semarang", revenue: 32000000 },
  { branch: "Makassar", revenue: 28000000 },
  { branch: "Yogyakarta", revenue: 25000000 },
];

export const dummyWeeklySuspensions: WeeklySuspension[] = [
  { week: "W1", suspensions: 12, reactivations: 8 },
  { week: "W2", suspensions: 15, reactivations: 10 },
  { week: "W3", suspensions: 9, reactivations: 12 },
  { week: "W4", suspensions: 18, reactivations: 7 },
  { week: "W5", suspensions: 14, reactivations: 11 },
  { week: "W6", suspensions: 11, reactivations: 9 },
  { week: "W7", suspensions: 16, reactivations: 13 },
  { week: "W8", suspensions: 10, reactivations: 15 },
];

export const dummyCommissionSummary: CommissionSummary[] = [
  { rep: "Andi S.", paid: 12500000, pending: 3200000 },
  { rep: "Budi P.", paid: 11800000, pending: 4100000 },
  { rep: "Citra L.", paid: 14200000, pending: 2800000 },
  { rep: "Dewi R.", paid: 10500000, pending: 3600000 },
  { rep: "Eka W.", paid: 13100000, pending: 2500000 },
  { rep: "Fajar M.", paid: 9800000, pending: 4500000 },
];

export const dummyInvoiceRegister: InvoiceRegisterRow[] = [
  { id: "1", invoiceNumber: "INV-2026-001", customerName: "PT Maju Bersama", amount: 5500000, status: "paid", date: "2026-05-01", branch: "Jakarta Pusat" },
  { id: "2", invoiceNumber: "INV-2026-002", customerName: "CV Sentosa", amount: 3200000, status: "unpaid", date: "2026-05-02", branch: "Bandung" },
  { id: "3", invoiceNumber: "INV-2026-003", customerName: "PT Abadi Jaya", amount: 8750000, status: "paid", date: "2026-05-03", branch: "Surabaya" },
  { id: "4", invoiceNumber: "INV-2026-004", customerName: "UD Makmur", amount: 2100000, status: "overdue", date: "2026-05-04", branch: "Medan" },
  { id: "5", invoiceNumber: "INV-2026-005", customerName: "PT Nusantara", amount: 6300000, status: "paid", date: "2026-05-05", branch: "Jakarta Selatan" },
  { id: "6", invoiceNumber: "INV-2026-006", customerName: "CV Berkah", amount: 4500000, status: "unpaid", date: "2026-05-06", branch: "Semarang" },
  { id: "7", invoiceNumber: "INV-2026-007", customerName: "PT Sejahtera", amount: 7200000, status: "paid", date: "2026-05-07", branch: "Makassar" },
  { id: "8", invoiceNumber: "INV-2026-008", customerName: "UD Barokah", amount: 1800000, status: "overdue", date: "2026-05-08", branch: "Yogyakarta" },
  { id: "9", invoiceNumber: "INV-2026-009", customerName: "PT Gemilang", amount: 9100000, status: "paid", date: "2026-05-09", branch: "Jakarta Pusat" },
  { id: "10", invoiceNumber: "INV-2026-010", customerName: "CV Damai", amount: 3600000, status: "unpaid", date: "2026-05-10", branch: "Bandung" },
  { id: "11", invoiceNumber: "INV-2026-011", customerName: "PT Cahaya", amount: 5900000, status: "paid", date: "2026-05-11", branch: "Surabaya" },
  { id: "12", invoiceNumber: "INV-2026-012", customerName: "UD Rezeki", amount: 2700000, status: "overdue", date: "2026-05-12", branch: "Medan" },
  { id: "13", invoiceNumber: "INV-2026-013", customerName: "PT Harapan", amount: 4800000, status: "paid", date: "2026-05-13", branch: "Jakarta Selatan" },
  { id: "14", invoiceNumber: "INV-2026-014", customerName: "CV Utama", amount: 6100000, status: "unpaid", date: "2026-05-14", branch: "Semarang" },
  { id: "15", invoiceNumber: "INV-2026-015", customerName: "PT Persada", amount: 7800000, status: "paid", date: "2026-05-15", branch: "Makassar" },
];

export const dummyArAgingDetail: ArAgingDetailRow[] = [
  { id: "1", customerName: "CV Sentosa", invoiceNumber: "INV-2026-002", amount: 3200000, daysOverdue: 3, bucket: "1-7 days" },
  { id: "2", customerName: "UD Makmur", invoiceNumber: "INV-2026-004", amount: 2100000, daysOverdue: 28, bucket: "15-30 days" },
  { id: "3", customerName: "CV Berkah", invoiceNumber: "INV-2026-006", amount: 4500000, daysOverdue: 5, bucket: "1-7 days" },
  { id: "4", customerName: "UD Barokah", invoiceNumber: "INV-2026-008", amount: 1800000, daysOverdue: 35, bucket: "30+ days" },
  { id: "5", customerName: "CV Damai", invoiceNumber: "INV-2026-010", amount: 3600000, daysOverdue: 10, bucket: "8-14 days" },
  { id: "6", customerName: "UD Rezeki", invoiceNumber: "INV-2026-012", amount: 2700000, daysOverdue: 22, bucket: "15-30 days" },
  { id: "7", customerName: "CV Utama", invoiceNumber: "INV-2026-014", amount: 6100000, daysOverdue: 2, bucket: "1-7 days" },
  { id: "8", customerName: "PT Sumber Rezeki", invoiceNumber: "INV-2026-016", amount: 4200000, daysOverdue: 42, bucket: "30+ days" },
  { id: "9", customerName: "UD Jaya", invoiceNumber: "INV-2026-017", amount: 1900000, daysOverdue: 12, bucket: "8-14 days" },
  { id: "10", customerName: "CV Mandiri", invoiceNumber: "INV-2026-018", amount: 5400000, daysOverdue: 18, bucket: "15-30 days" },
];

export const dummyFakturPajak: FakturPajakRow[] = [
  { id: "1", fpNumber: "FP-2026-001", invoiceNumber: "INV-2026-001", customerName: "PT Maju Bersama", npwp: "01.234.567.8-012.000", dpp: 5000000, ppn: 500000, total: 5500000 },
  { id: "2", fpNumber: "FP-2026-002", invoiceNumber: "INV-2026-003", customerName: "PT Abadi Jaya", npwp: "02.345.678.9-013.000", dpp: 7954545, ppn: 795455, total: 8750000 },
  { id: "3", fpNumber: "FP-2026-003", invoiceNumber: "INV-2026-005", customerName: "PT Nusantara", npwp: "03.456.789.0-014.000", dpp: 5727273, ppn: 572727, total: 6300000 },
  { id: "4", fpNumber: "FP-2026-004", invoiceNumber: "INV-2026-007", customerName: "PT Sejahtera", npwp: "04.567.890.1-015.000", dpp: 6545455, ppn: 654545, total: 7200000 },
  { id: "5", fpNumber: "FP-2026-005", invoiceNumber: "INV-2026-009", customerName: "PT Gemilang", npwp: "05.678.901.2-016.000", dpp: 8272727, ppn: 827273, total: 9100000 },
  { id: "6", fpNumber: "FP-2026-006", invoiceNumber: "INV-2026-011", customerName: "PT Cahaya", npwp: "06.789.012.3-017.000", dpp: 5363636, ppn: 536364, total: 5900000 },
  { id: "7", fpNumber: "FP-2026-007", invoiceNumber: "INV-2026-013", customerName: "PT Harapan", npwp: "07.890.123.4-018.000", dpp: 4363636, ppn: 436364, total: 4800000 },
  { id: "8", fpNumber: "FP-2026-008", invoiceNumber: "INV-2026-015", customerName: "PT Persada", npwp: "08.901.234.5-019.000", dpp: 7090909, ppn: 709091, total: 7800000 },
];

export const dummySuspensionList: SuspensionListRow[] = [
  { id: "1", customerName: "UD Makmur", status: "suspended", suspensionDate: "2026-05-01", duration: "30 days", branch: "Medan" },
  { id: "2", customerName: "CV Sentosa", status: "reactivated", suspensionDate: "2026-04-15", duration: "14 days", branch: "Bandung" },
  { id: "3", customerName: "UD Barokah", status: "suspended", suspensionDate: "2026-05-05", duration: "25 days", branch: "Yogyakarta" },
  { id: "4", customerName: "PT Sumber Rezeki", status: "pending", suspensionDate: "2026-05-10", duration: "-", branch: "Jakarta Pusat" },
  { id: "5", customerName: "UD Rezeki", status: "suspended", suspensionDate: "2026-05-03", duration: "28 days", branch: "Medan" },
  { id: "6", customerName: "CV Berkah", status: "reactivated", suspensionDate: "2026-04-20", duration: "10 days", branch: "Semarang" },
  { id: "7", customerName: "UD Jaya", status: "suspended", suspensionDate: "2026-05-08", duration: "22 days", branch: "Surabaya" },
  { id: "8", customerName: "CV Mandiri", status: "pending", suspensionDate: "2026-05-12", duration: "-", branch: "Makassar" },
];

export const dummyCommissionDetail: CommissionDetailRow[] = [
  { id: "1", salesRep: "Andi S.", customerName: "PT Maju Bersama", invoiceNumber: "INV-2026-001", amount: 1650000, split: "30/20/15/15/20", status: "paid" },
  { id: "2", salesRep: "Budi P.", customerName: "CV Sentosa", invoiceNumber: "INV-2026-002", amount: 960000, split: "30/20/15/15/20", status: "pending" },
  { id: "3", salesRep: "Citra L.", customerName: "PT Abadi Jaya", invoiceNumber: "INV-2026-003", amount: 2625000, split: "30/20/15/15/20", status: "paid" },
  { id: "4", salesRep: "Dewi R.", customerName: "PT Nusantara", invoiceNumber: "INV-2026-005", amount: 1890000, split: "30/20/15/15/20", status: "paid" },
  { id: "5", salesRep: "Eka W.", customerName: "PT Sejahtera", invoiceNumber: "INV-2026-007", amount: 2160000, split: "30/20/15/15/20", status: "pending" },
  { id: "6", salesRep: "Fajar M.", customerName: "PT Gemilang", invoiceNumber: "INV-2026-009", amount: 2730000, split: "30/20/15/15/20", status: "paid" },
  { id: "7", salesRep: "Andi S.", customerName: "PT Cahaya", invoiceNumber: "INV-2026-011", amount: 1770000, split: "30/20/15/15/20", status: "pending" },
  { id: "8", salesRep: "Budi P.", customerName: "PT Harapan", invoiceNumber: "INV-2026-013", amount: 1440000, split: "30/20/15/15/20", status: "paid" },
  { id: "9", salesRep: "Citra L.", customerName: "PT Persada", invoiceNumber: "INV-2026-015", amount: 2340000, split: "30/20/15/15/20", status: "paid" },
  { id: "10", salesRep: "Dewi R.", customerName: "PT Cahaya", invoiceNumber: "INV-2026-019", amount: 1350000, split: "30/20/15/15/20", status: "pending" },
];

export const formatIDR = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactIDR = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}K`;
  }
  return `Rp ${value}`;
};
