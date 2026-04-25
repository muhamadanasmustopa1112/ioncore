import { create } from "zustand";
import { DuplicatePair, DuplicateStatus } from "../types/duplicate-review";
import { DUMMY_PAIRS } from "../data/dummy-pairs";

interface DuplicateReviewState {
  pairs: DuplicatePair[];
  selectedPair: DuplicatePair | null;
  sheetOpen: boolean;
  openReview: (pair: DuplicatePair) => void;
  closeSheet: () => void;
  resolvePair: (
    id: string,
    status: DuplicateStatus,
    masterId?: string
  ) => void;
}

export const useDuplicateReviewStore = create<DuplicateReviewState>((set) => ({
  pairs: DUMMY_PAIRS,
  selectedPair: null,
  sheetOpen: false,
  openReview: (pair) => set({ selectedPair: pair, sheetOpen: true }),
  closeSheet: () => set({ sheetOpen: false, selectedPair: null }),
  resolvePair: (id, status, masterId) =>
    set((state) => ({
      pairs: state.pairs.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              masterId: masterId ?? p.masterId,
              resolvedAt: new Date().toISOString(),
              resolvedBy: "admin",
            }
          : p
      ),
      sheetOpen: false,
      selectedPair: null,
    })),
}));
