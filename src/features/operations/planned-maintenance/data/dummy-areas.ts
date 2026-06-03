export type DummyArea = {
  area_id: string;
  area_name: string;
  sub_areas: { sub_area_id: string; sub_area_name: string }[];
};

export type DummyCustomerCount = {
  sub_area_id: string;
  broadband: number;
  business: number;
  enterprise: number;
};

export const DUMMY_AREAS: DummyArea[] = [
  {
    area_id: "AREA-001", area_name: "Jakarta Utara",
    sub_areas: [
      { sub_area_id: "SUB-001", sub_area_name: "Kelapa Gading" },
      { sub_area_id: "SUB-012", sub_area_name: "Pluit" },
      { sub_area_id: "SUB-013", sub_area_name: "Kemayoran" },
    ],
  },
  {
    area_id: "AREA-002", area_name: "Jakarta Timur",
    sub_areas: [
      { sub_area_id: "SUB-002", sub_area_name: "Bambu Apus" },
      { sub_area_id: "SUB-003", sub_area_name: "Ciracas" },
      { sub_area_id: "SUB-014", sub_area_name: "Cakung" },
    ],
  },
  {
    area_id: "AREA-003", area_name: "Jakarta Selatan",
    sub_areas: [
      { sub_area_id: "SUB-004", sub_area_name: "Kebayoran" },
      { sub_area_id: "SUB-005", sub_area_name: "Pancoran" },
      { sub_area_id: "SUB-007", sub_area_name: "Gambir" },
    ],
  },
  {
    area_id: "AREA-004", area_name: "Jakarta Pusat",
    sub_areas: [
      { sub_area_id: "SUB-006", sub_area_name: "Bandung Kota" },
      { sub_area_id: "SUB-008", sub_area_name: "Menteng" },
    ],
  },
  {
    area_id: "AREA-005", area_name: "Depok",
    sub_areas: [
      { sub_area_id: "SUB-009", sub_area_name: "Depok Kota" },
    ],
  },
  {
    area_id: "AREA-006", area_name: "Tangerang",
    sub_areas: [
      { sub_area_id: "SUB-010", sub_area_name: "Tangerang Kota" },
    ],
  },
  {
    area_id: "AREA-007", area_name: "Bekasi",
    sub_areas: [
      { sub_area_id: "SUB-011", sub_area_name: "Bekasi Kota" },
    ],
  },
];

export const DUMMY_CUSTOMER_COUNTS: DummyCustomerCount[] = [
  { sub_area_id: "SUB-001", broadband: 120, business: 18, enterprise: 9 },
  { sub_area_id: "SUB-002", broadband: 65, business: 12, enterprise: 12 },
  { sub_area_id: "SUB-003", broadband: 198, business: 22, enterprise: 14 },
  { sub_area_id: "SUB-004", broadband: 156, business: 20, enterprise: 8 },
  { sub_area_id: "SUB-005", broadband: 134, business: 15, enterprise: 7 },
  { sub_area_id: "SUB-006", broadband: 280, business: 15, enterprise: 5 },
  { sub_area_id: "SUB-007", broadband: 90, business: 8, enterprise: 2 },
  { sub_area_id: "SUB-008", broadband: 165, business: 12, enterprise: 12 },
  { sub_area_id: "SUB-009", broadband: 130, business: 18, enterprise: 8 },
  { sub_area_id: "SUB-010", broadband: 0, business: 0, enterprise: 0 },
  { sub_area_id: "SUB-011", broadband: 55, business: 8, enterprise: 4 },
  { sub_area_id: "SUB-012", broadband: 88, business: 10, enterprise: 3 },
  { sub_area_id: "SUB-013", broadband: 76, business: 9, enterprise: 2 },
  { sub_area_id: "SUB-014", broadband: 110, business: 14, enterprise: 6 },
];

export const DUMMY_DOWNSTREAM_NODES: Record<string, string[]> = {
  "NODE-001": ["NODE-002", "NODE-003"],
  "NODE-004": ["NODE-005"],
  "NODE-011": ["NODE-012"],
};
