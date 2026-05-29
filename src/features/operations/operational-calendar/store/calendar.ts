import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent, CalendarFilters, CalendarViewType, CalendarEventType } from "../types";

interface CalendarState {
  currentMonth: string;
  selectedEvent: CalendarEvent | null;
  filters: CalendarFilters;
  view: CalendarViewType;
  setCurrentMonth: (month: string) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setFilters: (filters: Partial<CalendarFilters>) => void;
  setView: (view: CalendarViewType) => void;
  addEventTypeFilter: (eventType: CalendarEventType) => void;
  removeEventTypeFilter: (eventType: CalendarEventType) => void;
  clearFilters: () => void;
}

const DEFAULT_FILTERS: CalendarFilters = {
  event_types: [],
  area_id: null,
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      currentMonth: "2026-06",
      selectedEvent: null,
      filters: DEFAULT_FILTERS,
      view: "monthly",
      setCurrentMonth: (month) => set({ currentMonth: month }),
      setSelectedEvent: (event) => set({ selectedEvent: event }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      setView: (view) => set({ view }),
      addEventTypeFilter: (eventType) =>
        set((state) => ({
          filters: {
            ...state.filters,
            event_types: [...state.filters.event_types, eventType],
          },
        })),
      removeEventTypeFilter: (eventType) =>
        set((state) => ({
          filters: {
            ...state.filters,
            event_types: state.filters.event_types.filter((t) => t !== eventType),
          },
        })),
      clearFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: "calendar-storage",
      partialize: (state) => ({
        currentMonth: state.currentMonth,
        view: state.view,
        filters: state.filters,
      }),
    },
  ),
);
