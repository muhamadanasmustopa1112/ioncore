import { create } from "zustand";
import { SchemaType, SchemaFormMode } from "../types";
import type { CustomerSchema } from "@/features/rule-schema";

export type SchemaView =
  | "schemas"
  | "assignment-rules"
  | "customer-overrides"
  | "change-policies"
  | "upgrade-rules"
  | "change-matrix"
  | "broadband-plan-schemas"
  | "schema-migration";

export interface OverrideChange {
  field: string;
  prev: string;
  next: string;
}

interface SchemaStore {
  activeSchemaType: SchemaType;
  form: SchemaFormMode;
  schemaSheetOpen: boolean;
  approvalPanelOpen: boolean;
  migrationPanelOpen: boolean;
  historyPanelOpen: boolean;
  selectedSchemaId: string | null;
  view: SchemaView;
  formSubmitter: (() => void) | null;
  sheetLoading: boolean;
  pendingApproval: boolean;
  overrideCustomerSchema: CustomerSchema | null;
  overrideConfirmOpen: boolean;
  overrideChanges: OverrideChange[];
  overrideConfirmTrigger: number;

  setView: (view: SchemaView) => void;
  setActiveSchemaType: (type: SchemaType) => void;
  setSelectedSchemaId: (id: string | null) => void;
  openSchemaSheet: (form: "new" | "edit" | "details" | "clone") => void;
  openOverrideSheet: (customerSchema: CustomerSchema) => void;
  openViewOverrideSheet: (customerSchema: CustomerSchema) => void;
  closeSchemaSheet: () => void;
  setForm: (form: SchemaFormMode) => void;
  openApprovalPanel: (schemaId: string) => void;
  closeApprovalPanel: () => void;
  openMigrationPanel: () => void;
  closeMigrationPanel: () => void;
  openHistoryPanel: (schemaId: string) => void;
  closeHistoryPanel: () => void;
  setFormSubmitter: (fn: (() => void) | null) => void;
  setSheetLoading: (v: boolean) => void;
  setPendingApproval: (v: boolean) => void;
  openOverrideConfirm: (changes: OverrideChange[]) => void;
  closeOverrideConfirm: () => void;
  confirmOverride: () => void;
}

function normalizeSchemaType(raw: string): SchemaType {
  const v = raw.toLowerCase().replace(/[\s-]+/g, "_");
  if (v === "billing" || v === "service" || v === "suspension" || v === "commission" || v === "onboarding" || v === "work_order") {
    return v;
  }
  return "billing";
}

const useSchemaStore = create<SchemaStore>((set) => ({
  activeSchemaType: "billing",
  form: null,
  schemaSheetOpen: false,
  approvalPanelOpen: false,
  migrationPanelOpen: false,
  historyPanelOpen: false,
  selectedSchemaId: null,
  view: "schemas",
  formSubmitter: null,
  sheetLoading: false,
  pendingApproval: false,
  overrideCustomerSchema: null,
  overrideConfirmOpen: false,
  overrideChanges: [],
  overrideConfirmTrigger: 0,

  setView: (view) => set({ view }),
  setActiveSchemaType: (type) => set({ activeSchemaType: type }),
  setSelectedSchemaId: (id) => set({ selectedSchemaId: id }),
  setForm: (form) => set({ form }),
  openSchemaSheet: (form) => set({ schemaSheetOpen: true, form, overrideCustomerSchema: null }),
  openOverrideSheet: (customerSchema) =>
    set({
      schemaSheetOpen: true,
      form: "override",
      overrideCustomerSchema: customerSchema,
      activeSchemaType: normalizeSchemaType(customerSchema.schema_type),
    }),
  openViewOverrideSheet: (customerSchema) =>
    set({
      schemaSheetOpen: true,
      form: "view_override",
      overrideCustomerSchema: customerSchema,
      activeSchemaType: normalizeSchemaType(customerSchema.schema_type),
    }),
  closeSchemaSheet: () =>
    set({
      schemaSheetOpen: false,
      form: null,
      selectedSchemaId: null,
      formSubmitter: null,
      sheetLoading: false,
      pendingApproval: false,
      overrideCustomerSchema: null,
      overrideConfirmOpen: false,
      overrideChanges: [],
      overrideConfirmTrigger: 0,
    }),
  setPendingApproval: (v) => set({ pendingApproval: v }),
  openApprovalPanel: (schemaId) =>
    set({ approvalPanelOpen: true, selectedSchemaId: schemaId }),
  closeApprovalPanel: () => set({ approvalPanelOpen: false, selectedSchemaId: null }),
  openMigrationPanel: () => set({ migrationPanelOpen: true }),
  closeMigrationPanel: () => set({ migrationPanelOpen: false }),
  openHistoryPanel: (schemaId) =>
    set({ historyPanelOpen: true, selectedSchemaId: schemaId }),
  closeHistoryPanel: () => set({ historyPanelOpen: false }),
  setFormSubmitter: (fn) => set({ formSubmitter: fn }),
  setSheetLoading: (v) => set({ sheetLoading: v }),
  openOverrideConfirm: (changes) =>
    set({ overrideConfirmOpen: true, overrideChanges: changes }),
  closeOverrideConfirm: () =>
    set({ overrideConfirmOpen: false, overrideChanges: [] }),
  confirmOverride: () =>
    set((s) => ({ overrideConfirmOpen: false, overrideChanges: [], overrideConfirmTrigger: s.overrideConfirmTrigger + 1 })),
}));

export { useSchemaStore };
