import { create } from "zustand";
import { SchemaType, SchemaFormMode } from "../types";

interface SchemaStore {
  activeSchemaType: SchemaType;
  form: SchemaFormMode;
  schemaSheetOpen: boolean;
  approvalPanelOpen: boolean;
  migrationPanelOpen: boolean;
  historyPanelOpen: boolean;
  selectedSchemaId: string | null;

  setActiveSchemaType: (type: SchemaType) => void;
  setSelectedSchemaId: (id: string | null) => void;
  openSchemaSheet: (form: "new" | "edit" | "details") => void;
  closeSchemaSheet: () => void;
  setForm: (form: SchemaFormMode) => void;
  openApprovalPanel: (schemaId: string) => void;
  closeApprovalPanel: () => void;
  openMigrationPanel: () => void;
  closeMigrationPanel: () => void;
  openHistoryPanel: (schemaId: string) => void;
  closeHistoryPanel: () => void;
}

const useSchemaStore = create<SchemaStore>((set) => ({
  activeSchemaType: "billing",
  form: null,
  schemaSheetOpen: false,
  approvalPanelOpen: false,
  migrationPanelOpen: false,
  historyPanelOpen: false,
  selectedSchemaId: null,

  setActiveSchemaType: (type) => set({ activeSchemaType: type }),
  setSelectedSchemaId: (id) => set({ selectedSchemaId: id }),
  setForm: (form) => set({ form }),
  openSchemaSheet: (form) => set({ schemaSheetOpen: true, form }),
  closeSchemaSheet: () =>
    set({ schemaSheetOpen: false, form: null, selectedSchemaId: null }),
  openApprovalPanel: (schemaId) =>
    set({ approvalPanelOpen: true, selectedSchemaId: schemaId }),
  closeApprovalPanel: () => set({ approvalPanelOpen: false }),
  openMigrationPanel: () => set({ migrationPanelOpen: true }),
  closeMigrationPanel: () => set({ migrationPanelOpen: false }),
  openHistoryPanel: (schemaId) =>
    set({ historyPanelOpen: true, selectedSchemaId: schemaId }),
  closeHistoryPanel: () => set({ historyPanelOpen: false }),
}));

export { useSchemaStore };
