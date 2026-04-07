import { create } from "zustand";
import { CustomerData } from "../types";

interface CustomerState {
  form: "new" | "edit" | "details" | null;
  customerSheetOpen: boolean;
  formData: Partial<CustomerData>;
  openCustomerFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeCustomerFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setCustomerFormSheetOpen: (open: boolean) => void;
  updateFormData: (data: Partial<CustomerData>) => void;
  resetForm: () => void;
}

const initialFormData: Partial<CustomerData> = {
  // Identity & Contact Defaults
  odpPop: "no odp | pop",
  identityNo: "",
  mobile: "",
  countryCode: "+62",
  email: "",
  address: "",
  latitude: "",
  longitude: "",

  // Login Credentials Defaults
  loginMethod: "USERNAME AND PASSWORD",
  username: "",
  password: "",
  confirmPassword: "",
  clientAreaPassword: "",
  note: "",

  // Existing Service Plan Defaults
  registrationStatus: "active",
  customerType: "regular",
  serverName: "",
  paymentType: "PREPAID",
  payStatus: "PAID",
  accountStatus: "ENABLED",
  bindOnLogin: false,
  collectVat: true,
  autoProrate: false,
  promo: false,
  promoDuration: "1 MONTHS",
  discount: 0,
  sellerFee: 0,
  installationFee: 0,
  deviceFee: 0,
  dueDate: "",
  expirationAction: "DISCONNECT INTERNET ( SUSPENDED )",
  ipAddressType: "Dynamic",
  ipAddress: "",
};

const useCustomerStore = create<CustomerState>((set) => ({
  form: "new",
  customerSheetOpen: false,
  formData: initialFormData,
  setForm: (form) => set((state) => ({ ...state, form })),
  setCustomerFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, customerSheetOpen: open })),
  openCustomerFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, customerSheetOpen: true, form })),
  closeCustomerFormSheet: () =>
    set((state) => ({ ...state, customerSheetOpen: false, form: null })),
  updateFormData: (data) =>
    set((state) => ({ ...state, formData: { ...state.formData, ...data } })),
  resetForm: () => set((state) => ({ ...state, formData: initialFormData })),
}));

export { useCustomerStore };
