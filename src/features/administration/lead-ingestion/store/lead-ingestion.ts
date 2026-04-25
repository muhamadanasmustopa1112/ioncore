import { create } from "zustand";
import {
  ExternalSource,
  FieldMapping,
  MappingRow,
  SourceFormMode,
} from "../types/lead-ingestion";
import { DUMMY_SOURCES, DUMMY_MAPPINGS } from "../data/dummy-sources";

type SheetView = "form" | "mapping" | null;

interface LeadIngestionState {
  sources: ExternalSource[];
  mappings: Record<string, FieldMapping>;
  sheetOpen: boolean;
  sheetView: SheetView;
  form: SourceFormMode;
  selectedSource: ExternalSource | null;
  openForm: (form: SourceFormMode, source?: ExternalSource) => void;
  openMapping: (source: ExternalSource) => void;
  closeSheet: () => void;
  upsertSource: (source: ExternalSource) => void;
  removeSource: (id: string) => void;
  toggleStatus: (id: string) => void;
  saveMapping: (sourceId: string, rows: MappingRow[]) => void;
}

export const useLeadIngestionStore = create<LeadIngestionState>((set) => ({
  sources: DUMMY_SOURCES,
  mappings: DUMMY_MAPPINGS,
  sheetOpen: false,
  sheetView: null,
  form: null,
  selectedSource: null,
  openForm: (form, source) =>
    set({ sheetOpen: true, sheetView: "form", form, selectedSource: source ?? null }),
  openMapping: (source) =>
    set({ sheetOpen: true, sheetView: "mapping", form: null, selectedSource: source }),
  closeSheet: () =>
    set({ sheetOpen: false, sheetView: null, form: null, selectedSource: null }),
  upsertSource: (source) =>
    set((state) => {
      const exists = state.sources.some((s) => s.id === source.id);
      const sources = exists
        ? state.sources.map((s) => (s.id === source.id ? source : s))
        : [source, ...state.sources];
      return { sources };
    }),
  removeSource: (id) =>
    set((state) => ({
      sources: state.sources.filter((s) => s.id !== id),
      mappings: Object.fromEntries(
        Object.entries(state.mappings).filter(([sid]) => sid !== id)
      ),
    })),
  toggleStatus: (id) =>
    set((state) => ({
      sources: state.sources.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active", updatedAt: new Date().toISOString() }
          : s
      ),
    })),
  saveMapping: (sourceId, rows) =>
    set((state) => ({
      mappings: { ...state.mappings, [sourceId]: { sourceId, rows } },
    })),
}));
