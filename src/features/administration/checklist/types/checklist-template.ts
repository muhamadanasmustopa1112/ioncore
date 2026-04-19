import type {
  CaptureType,
  CaptureConstraintsDto,
  WoType,
  MaintenanceSubtype,
  TemplateStatus,
} from "./checklist-template-api";

export type { CaptureType, WoType, MaintenanceSubtype, TemplateStatus };

export type TemplateFormMode = "new" | "edit" | "details" | null;

export interface Capture {
  captureId: string;
  type: CaptureType;
  label: string;
  required: boolean;
  constraints: CaptureConstraintsDto;
}

export interface Step {
  stepId: string;
  order: number;
  title: string;
  instructionMarkdown: string;
  required: boolean;
  when: string;
  captures: Capture[];
}

export interface CompletionRules {
  blockBastUntilAllRequired: boolean;
  allowSkipOptionalWithNote: boolean;
  resolutionLogFromSteps: boolean;
}

export interface ChecklistTemplate {
  id: string;
  schemaName: string;
  schemaVersion: string;
  woType: WoType;
  maintenanceSubtype: MaintenanceSubtype | null;
  productType: string;
  appliesToPackageCodes: string[];
  description: string;
  status: TemplateStatus;
  steps: Step[];
  completionRules: CompletionRules;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const WO_TYPE_LABELS: Record<WoType, string> = {
  new_installation: "New Installation",
  maintenance: "Maintenance",
  termination: "Termination",
  infrastructure_deployment: "Infrastructure Deployment",
};

export const CAPTURE_TYPE_LABELS: Record<CaptureType, string> = {
  text: "Text Input",
  photo: "Photo",
  barcode_scan: "Barcode Scan",
  qr_scan: "QR Scan",
  signature: "Signature",
  file_upload: "File Upload",
  number: "Number",
  checkbox: "Checkbox",
  select: "Select",
};

export const STATUS_LABELS: Record<TemplateStatus, string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
};
