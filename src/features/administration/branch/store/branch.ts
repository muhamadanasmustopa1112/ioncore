import { create } from "zustand";
import {
  BranchData,
  BranchFormMode,
  BranchPayload,
  BranchListParams,
  BranchFlatDto,
  BranchTreeNode,
  PaginationMeta,
  RegionalBranchDto,
  AreaBranchDto,
  SubAreaBranchDto,
} from "../types";
import {
  getBranchList,
  getBranchTree,
  listRegional,
  getRegional,
  createRegional as apiCreateRegional,
  updateRegional as apiUpdateRegional,
  deleteRegional as apiDeleteRegional,
  listArea,
  createArea as apiCreateArea,
  updateArea as apiUpdateArea,
  deleteArea as apiDeleteArea,
  listSubArea,
  createSubArea as apiCreateSubArea,
  updateSubArea as apiUpdateSubArea,
  deleteSubArea as apiDeleteSubArea,
} from "../api/branch-api";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface BranchState {
  // ─── Sheet / Form UI state ──────────────────────────────────────────────────
  form: BranchFormMode;
  branchSheetOpen: boolean;
  selectedBranch: BranchData | null;
  setForm: (form: BranchFormMode) => void;
  setBranchFormSheetOpen: (open: boolean) => void;
  defaultNewType: string;
  openBranchFormSheet: (form: BranchFormMode, branch?: BranchData, defaultType?: string) => void;
  closeBranchFormSheet: () => void;

  // ─── Flat list (GET /branch) ─────────────────────────────────────────────────
  flatList: BranchFlatDto[];
  flatMeta: PaginationMeta | null;
  flatListLoading: boolean;
  flatListError: string | null;
  fetchFlatList: (params?: BranchListParams) => Promise<void>;

  // ─── Tree (GET /branch/tree) ─────────────────────────────────────────────────
  tree: BranchTreeNode[];
  treePagination: PaginationMeta | null;
  treeLoading: boolean;
  treeError: string | null;
  fetchTree: (params?: BranchListParams) => Promise<void>;

  // ─── Regional ────────────────────────────────────────────────────────────────
  regionals: RegionalBranchDto[];
  regionalPagination: PaginationMeta | null;
  regionalsLoading: boolean;
  regionalsError: string | null;
  fetchRegionals: (params?: BranchListParams) => Promise<void>;
  fetchRegional: (id: string) => Promise<RegionalBranchDto | null>;
  createRegional: (payload: BranchPayload) => Promise<RegionalBranchDto | null>;
  updateRegional: (id: string, payload: BranchPayload) => Promise<RegionalBranchDto | null>;
  deleteRegional: (id: string) => Promise<boolean>;

  // ─── Area (keyed by regionalId) ──────────────────────────────────────────────
  areas: Record<string, AreaBranchDto[]>;
  areaPagination: Record<string, PaginationMeta>;
  areasLoading: boolean;
  areasError: string | null;
  fetchAreas: (regionalId: string, params?: BranchListParams) => Promise<void>;
  createArea: (regionalId: string, payload: BranchPayload) => Promise<AreaBranchDto | null>;
  updateArea: (regionalId: string, areaId: string, payload: BranchPayload) => Promise<AreaBranchDto | null>;
  deleteArea: (regionalId: string, areaId: string) => Promise<boolean>;

  // ─── Sub Area (keyed by "${regionalId}:${areaId}") ───────────────────────────
  subAreas: Record<string, SubAreaBranchDto[]>;
  subAreaPagination: Record<string, PaginationMeta>;
  subAreasLoading: boolean;
  subAreasError: string | null;
  fetchSubAreas: (regionalId: string, areaId: string, params?: BranchListParams) => Promise<void>;
  createSubArea: (regionalId: string, areaId: string, payload: BranchPayload) => Promise<SubAreaBranchDto | null>;
  updateSubArea: (regionalId: string, areaId: string, subAreaId: string, payload: BranchPayload) => Promise<SubAreaBranchDto | null>;
  deleteSubArea: (regionalId: string, areaId: string, subAreaId: string) => Promise<boolean>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const useBranchStore = create<BranchState>((set, get) => ({
  // ─── Sheet / Form UI state ──────────────────────────────────────────────────
  form: "new",
  branchSheetOpen: false,
  selectedBranch: null,
  defaultNewType: "office",

  setForm: (form) => set({ form }),
  setBranchFormSheetOpen: (open) => set({ branchSheetOpen: open }),
  openBranchFormSheet: (form, branch, defaultType) =>
    set({ branchSheetOpen: true, form, selectedBranch: branch ?? null, defaultNewType: defaultType ?? "office" }),
  closeBranchFormSheet: () =>
    set({ branchSheetOpen: false, form: null, selectedBranch: null, defaultNewType: "office" }),

  // ─── Flat list ──────────────────────────────────────────────────────────────
  flatList: [],
  flatMeta: null,
  flatListLoading: false,
  flatListError: null,

  fetchFlatList: async (params) => {
    set({ flatListLoading: true, flatListError: null });
    try {
      const res = await getBranchList(params);
      if (res.data !== null && res.data) {
        set({ flatList: res.data.branches, flatMeta: res.data.metadata });
      } else {
        set({ flatListError: res.message });
      }
    } catch (err) {
      set({ flatListError: err instanceof Error ? err.message : "Failed to fetch branch list" });
    } finally {
      set({ flatListLoading: false });
    }
  },

  // ─── Tree ────────────────────────────────────────────────────────────────────
  tree: [],
  treePagination: null,
  treeLoading: false,
  treeError: null,

  fetchTree: async (params) => {
    set({ treeLoading: true, treeError: null });
    try {
      const res = await getBranchTree(params);
      if (res.data !== null && res.data) {
        set({ tree: res.data.branches, treePagination: res.data.metadata });
      } else {
        set({ treeError: res.message });
      }
    } catch (err) {
      set({ treeError: err instanceof Error ? err.message : "Failed to fetch branch tree" });
    } finally {
      set({ treeLoading: false });
    }
  },

  // ─── Regional ────────────────────────────────────────────────────────────────
  regionals: [],
  regionalPagination: null,
  regionalsLoading: false,
  regionalsError: null,

  fetchRegionals: async (params) => {
    set({ regionalsLoading: true, regionalsError: null });
    try {
      const res = await listRegional(params);
      if (res.data !== null && res.data) {
        set({ regionals: res.data.branches, regionalPagination: res.data.metadata });
      } else {
        set({ regionalsError: res.message });
      }
    } catch (err) {
      set({ regionalsError: err instanceof Error ? err.message : "Failed to fetch regionals" });
    } finally {
      set({ regionalsLoading: false });
    }
  },

  fetchRegional: async (id) => {
    try {
      const res = await getRegional(id);
      if (res.data !== null && res.data) {
        // Upsert into regionals list
        set((state) => {
          const exists = state.regionals.findIndex((r) => r.id === id);
          const updated =
            exists >= 0
              ? state.regionals.map((r) => (r.id === id ? res.data! : r))
              : [...state.regionals, res.data!];
          return { regionals: updated };
        });
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  createRegional: async (payload) => {
    try {
      const res = await apiCreateRegional(payload);
      if (res.data !== null && res.data) {
        set((state) => ({ regionals: [...state.regionals, res.data!] }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  updateRegional: async (id, payload) => {
    try {
      const res = await apiUpdateRegional(id, payload);
      if (res.data !== null && res.data) {
        set((state) => ({
          regionals: state.regionals.map((r) => (r.id === id ? res.data! : r)),
        }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  deleteRegional: async (id) => {
    try {
      const res = await apiDeleteRegional(id);
      if (res.data !== null) {
        set((state) => ({
          regionals: state.regionals.filter((r) => r.id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ─── Area ─────────────────────────────────────────────────────────────────────
  areas: {},
  areaPagination: {},
  areasLoading: false,
  areasError: null,

  fetchAreas: async (regionalId, params) => {
    set({ areasLoading: true, areasError: null });
    try {
      const res = await listArea(regionalId, params);
      if (res.data !== null && res.data) {
        set((state) => ({
          areas: { ...state.areas, [regionalId]: res.data!.branches },
          areaPagination: { ...state.areaPagination, [regionalId]: res.data!.metadata },
        }));
      } else {
        set({ areasError: res.message });
      }
    } catch (err) {
      set({ areasError: err instanceof Error ? err.message : "Failed to fetch areas" });
    } finally {
      set({ areasLoading: false });
    }
  },

  createArea: async (regionalId, payload) => {
    try {
      const res = await apiCreateArea(regionalId, payload);
      if (res.data !== null && res.data) {
        set((state) => ({
          areas: {
            ...state.areas,
            [regionalId]: [...(state.areas[regionalId] ?? []), res.data!],
          },
        }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  updateArea: async (regionalId, areaId, payload) => {
    try {
      const res = await apiUpdateArea(regionalId, areaId, payload);
      if (res.data !== null && res.data) {
        set((state) => ({
          areas: {
            ...state.areas,
            [regionalId]: (state.areas[regionalId] ?? []).map((a) =>
              a.id === areaId ? res.data! : a
            ),
          },
        }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  deleteArea: async (regionalId, areaId) => {
    try {
      const res = await apiDeleteArea(regionalId, areaId);
      if (res.data !== null) {
        set((state) => ({
          areas: {
            ...state.areas,
            [regionalId]: (state.areas[regionalId] ?? []).filter((a) => a.id !== areaId),
          },
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // ─── Sub Area ─────────────────────────────────────────────────────────────────
  subAreas: {},
  subAreaPagination: {},
  subAreasLoading: false,
  subAreasError: null,

  fetchSubAreas: async (regionalId, areaId, params) => {
    const key = `${regionalId}:${areaId}`;
    set({ subAreasLoading: true, subAreasError: null });
    try {
      const res = await listSubArea(regionalId, areaId, params);
      if (res.data !== null && res.data) {
        set((state) => ({
          subAreas: { ...state.subAreas, [key]: res.data!.branches },
          subAreaPagination: { ...state.subAreaPagination, [key]: res.data!.metadata },
        }));
      } else {
        set({ subAreasError: res.message });
      }
    } catch (err) {
      set({ subAreasError: err instanceof Error ? err.message : "Failed to fetch sub areas" });
    } finally {
      set({ subAreasLoading: false });
    }
  },

  createSubArea: async (regionalId, areaId, payload) => {
    const key = `${regionalId}:${areaId}`;
    try {
      const res = await apiCreateSubArea(regionalId, areaId, payload);
      if (res.data !== null && res.data) {
        set((state) => ({
          subAreas: {
            ...state.subAreas,
            [key]: [...(state.subAreas[key] ?? []), res.data!],
          },
        }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  updateSubArea: async (regionalId, areaId, subAreaId, payload) => {
    const key = `${regionalId}:${areaId}`;
    try {
      const res = await apiUpdateSubArea(regionalId, areaId, subAreaId, payload);
      if (res.data !== null && res.data) {
        set((state) => ({
          subAreas: {
            ...state.subAreas,
            [key]: (state.subAreas[key] ?? []).map((s) =>
              s.id === subAreaId ? res.data! : s
            ),
          },
        }));
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  deleteSubArea: async (regionalId, areaId, subAreaId) => {
    const key = `${regionalId}:${areaId}`;
    try {
      const res = await apiDeleteSubArea(regionalId, areaId, subAreaId);
      if (res.data !== null) {
        set((state) => ({
          subAreas: {
            ...state.subAreas,
            [key]: (state.subAreas[key] ?? []).filter((s) => s.id !== subAreaId),
          },
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));

export { useBranchStore };
