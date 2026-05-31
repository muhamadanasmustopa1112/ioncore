import { create } from "zustand";
import { PaymentItem } from "../types";

interface PaymentState {
  form: "new" | "edit" | "details" | null;
  paymentSheetOpen: boolean;
  selectedPayment: PaymentItem | null;
  openPaymentFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closePaymentFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setPaymentFormSheetOpen: (open: boolean) => void;
  setSelectedPayment: (payment: PaymentItem | null) => void;
}

const usePaymentStore = create<PaymentState>((set) => ({
  form: "new",
  paymentSheetOpen: false,
  selectedPayment: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setPaymentFormSheetOpen: (open) =>
    set((state) => ({ ...state, paymentSheetOpen: open })),
  openPaymentFormSheet: (form) =>
    set((state) => ({ ...state, paymentSheetOpen: true, form })),
  closePaymentFormSheet: () =>
    set((state) => ({ ...state, paymentSheetOpen: false, form: null })),
  setSelectedPayment: (payment) =>
    set((state) => ({ ...state, selectedPayment: payment })),
}));

export { usePaymentStore };
