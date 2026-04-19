import { create } from "zustand";
import type { SchemaVersion, VersionSheetMode } from "../types/versioning";

interface VersioningState {
  sheetOpen: boolean;
  sheetMode: VersionSheetMode;
  selectedVersion: SchemaVersion | null;
  compareVersionId: string | null;
  openSheet: (mode: VersionSheetMode, version: SchemaVersion, compareVersionId?: string) => void;
  closeSheet: () => void;
}

export const useVersioningStore = create<VersioningState>((set) => ({
  sheetOpen: false,
  sheetMode: null,
  selectedVersion: null,
  compareVersionId: null,
  openSheet: (mode, version, compareVersionId) =>
    set({ sheetOpen: true, sheetMode: mode, selectedVersion: version, compareVersionId: compareVersionId ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, sheetMode: null, selectedVersion: null, compareVersionId: null }),
}));
