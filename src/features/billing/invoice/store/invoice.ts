import { create } from "zustand";
import { InvoiceItem } from "../types";

interface InvoiceState {
  form: "new" | "edit" | "details" | null;
  invoiceSheetOpen: boolean;
  selectedInvoice: InvoiceItem | null;
  openInvoiceFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeInvoiceFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setInvoiceFormSheetOpen: (open: boolean) => void;
  setSelectedInvoice: (invoice: InvoiceItem | null) => void;
}

const useInvoiceStore = create<InvoiceState>((set) => ({
  form: "new",
  invoiceSheetOpen: false,
  selectedInvoice: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setInvoiceFormSheetOpen: (open) =>
    set((state) => ({ ...state, invoiceSheetOpen: open })),
  openInvoiceFormSheet: (form) =>
    set((state) => ({ ...state, invoiceSheetOpen: true, form })),
  closeInvoiceFormSheet: () =>
    set((state) => ({ ...state, invoiceSheetOpen: false, form: null })),
  setSelectedInvoice: (invoice) =>
    set((state) => ({ ...state, selectedInvoice: invoice })),
}));

export { useInvoiceStore };
