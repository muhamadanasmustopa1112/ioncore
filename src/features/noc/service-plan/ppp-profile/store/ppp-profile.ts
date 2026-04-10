import { create } from "zustand";
import { PPPProfileFormValues } from "../types";

interface PPPProfileState {
  form: "new" | "edit" | "details" | null;
  pppProfileSheetOpen: boolean;
  formData: PPPProfileFormValues;
  openPPPProfileFormSheet: (form: "new" | "edit" | "details" | null, data?: Partial<PPPProfileFormValues>) => void;
  closePPPProfileFormSheet: () => void;
  setFormData: (data: Partial<PPPProfileFormValues>) => void;
  resetFormData: () => void;
}

const INITIAL_FORM_DATA: PPPProfileFormValues = {
  name: "",
  planeName: "",
  dataOwner: "radius_admin",
  capitalPrice: 0,
  sellPrice: 0,
  promoPrice: 0,
  vat: 0,
  profileGroup: "",
  bandwidth: "",
  planValidity: 0,
  timeUnit: "MINUTES",
  sharedUsers: 1,
  priority: 1,
  loginPeriod: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
  fromTime: "00:00",
  toTime: "23:59",
};

const usePPPProfileStore = create<PPPProfileState>((set) => ({
  form: "new",
  pppProfileSheetOpen: false,
  formData: INITIAL_FORM_DATA,
  
  openPPPProfileFormSheet: (form, data) =>
    set((state) => ({ 
      ...state, 
      pppProfileSheetOpen: true, 
      form,
      formData: data ? { ...state.formData, ...data } : INITIAL_FORM_DATA
    })),
    
  closePPPProfileFormSheet: () =>
    set((state) => ({ ...state, pppProfileSheetOpen: false, form: null })),
    
  setFormData: (data) =>
    set((state) => ({
      ...state,
      formData: { ...state.formData, ...data },
    })),
    
  resetFormData: () =>
    set((state) => ({ ...state, formData: INITIAL_FORM_DATA })),
}));

export { usePPPProfileStore };
