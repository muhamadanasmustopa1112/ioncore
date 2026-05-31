import { create } from "zustand";
import type { Ticket } from "../../types";

interface TicketState {
  sheetOpen: boolean;
  form: "new" | "edit" | "details" | null;
  selectedTicket: Ticket | null;
  openFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeFormSheet: () => void;
  setSelectedTicket: (ticket: Ticket | null) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  sheetOpen: false,
  form: null,
  selectedTicket: null,
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: null, selectedTicket: null })),
  setSelectedTicket: (ticket) => set((state) => ({ ...state, selectedTicket: ticket })),
}));
