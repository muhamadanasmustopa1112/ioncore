import { create } from "zustand";
import { CreatePPPCustomerRequest } from "../types";

interface CustomerState {
  form: "new" | "edit" | "details" | null;
  customerSheetOpen: boolean;
  selectedId: string | null;
  formData: Partial<CreatePPPCustomerRequest>;
  currentStep: number;
  openCustomerFormSheet: (form: "new" | "edit" | "details" | null, id?: string) => void;
  closeCustomerFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setSelectedId: (id: string | null) => void;
  setCustomerFormSheetOpen: (open: boolean) => void;
  updateFormData: (data: Partial<CreatePPPCustomerRequest>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}


const initialFormData: Partial<CreatePPPCustomerRequest> = {
  address: "",
  auth_status: "Enabled-Users",
  bandwidth: "",
  bind_mac: "NO",
  created_at: "",
  email: "",
  expired_on: "",
  fullname: "",
  mac_address: "",
  member_id: "",
  method: "pppoe",
  nasporttype: "Ethernet",
  note: "",
  owner_name: "radius_admin",
  password: "",
  payment_type: "POSTPAID",
  phonenumber: "",
  plan_name: "",
  remote_address: "Automatic",
  renewed_on: "",
  server_name: "",
  servicetype: "Framed-User",
  total: "0",
  trx_invoice: "",
  trx_status: "UNPAID",
  username: "",
};

const useCustomerStore = create<CustomerState>((set) => ({
  form: "new",
  customerSheetOpen: false,
  selectedId: null,
  formData: initialFormData,
  currentStep: 1,
  setForm: (form) => set((state) => ({ ...state, form })),
  setSelectedId: (id) => set((state) => ({ ...state, selectedId: id })),
  setCustomerFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, customerSheetOpen: open })),
  openCustomerFormSheet: (form, id) =>
    set((state) => ({ ...state, customerSheetOpen: true, form, selectedId: id || null })),
  closeCustomerFormSheet: () =>
    set((state) => ({ ...state, customerSheetOpen: false, form: null, selectedId: null })),
  updateFormData: (data) =>
    set((state) => ({ ...state, formData: { ...state.formData, ...data } })),
  setCurrentStep: (step) => set((state) => ({ ...state, currentStep: step })),
  resetForm: () => set((state) => ({ ...state, formData: initialFormData, currentStep: 1, selectedId: null })),
}));


export { useCustomerStore };
