import { create } from "zustand";
import type { Announcement } from "../types";

type FormMode = "new" | "edit" | "details";

interface AnnouncementState {
  sheetOpen: boolean;
  form: FormMode;
  selectedAnnouncement: Announcement | null;
  openFormSheet: (mode: FormMode) => void;
  closeFormSheet: () => void;
  setSelectedAnnouncement: (announcement: Announcement | null) => void;
  trackerOpen: boolean;
  trackerAnnouncement: Announcement | null;
  openTracker: (announcement: Announcement) => void;
  closeTracker: () => void;
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  sheetOpen: false,
  form: "new",
  selectedAnnouncement: null,
  openFormSheet: (mode) => set({ sheetOpen: true, form: mode }),
  closeFormSheet: () => set({ sheetOpen: false, selectedAnnouncement: null }),
  setSelectedAnnouncement: (announcement) => set({ selectedAnnouncement: announcement }),
  trackerOpen: false,
  trackerAnnouncement: null,
  openTracker: (announcement) => set({ trackerOpen: true, trackerAnnouncement: announcement }),
  closeTracker: () => set({ trackerOpen: false, trackerAnnouncement: null }),
}));
