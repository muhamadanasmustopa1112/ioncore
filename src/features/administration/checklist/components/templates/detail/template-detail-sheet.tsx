"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChecklistTemplateStore } from "../../../store/checklist-template";
import { useCreateTemplate, useUpdateTemplate } from "../../../api/checklist-template-queries";
import { StepsBuilder } from "./steps-builder";
import type { Step, CompletionRules, WoType, MaintenanceSubtype } from "../../../types/checklist-template";
import { WO_TYPE_LABELS } from "../../../types/checklist-template";

type TabId = "builder" | "rules" | "versions";

const WO_TYPES: WoType[] = ["new_installation", "maintenance", "termination", "infrastructure_deployment"];
const MAINTENANCE_SUBTYPES: MaintenanceSubtype[] = ["hardware_swap", "signal_issue", "config", "other"];

export function TemplateDetailSheet() {
  const sheetOpen = useChecklistTemplateStore((s) => s.sheetOpen);
  const closeSheet = useChecklistTemplateStore((s) => s.closeSheet);
  const form = useChecklistTemplateStore((s) => s.form);
  const selectedTemplate = useChecklistTemplateStore((s) => s.selectedTemplate);

  const isNew = form === "new";
  const isEdit = form === "edit";
  const isDetail = form === "details";

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const isPending = createTemplate.isPending || updateTemplate.isPending;

  const [activeTab, setActiveTab] = useState<TabId>("builder");
  const [schemaName, setSchemaName] = useState("");
  const [woType, setWoType] = useState<WoType>("new_installation");
  const [maintenanceSubtype, setMaintenanceSubtype] = useState<MaintenanceSubtype>("hardware_swap");
  const [productType, setProductType] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [completionRules, setCompletionRules] = useState<CompletionRules>({
    blockBastUntilAllRequired: true,
    allowSkipOptionalWithNote: false,
    resolutionLogFromSteps: false,
  });

  useEffect(() => {
    if (selectedTemplate) {
      setSchemaName(selectedTemplate.schemaName);
      setWoType(selectedTemplate.woType);
      setMaintenanceSubtype(selectedTemplate.maintenanceSubtype ?? "hardware_swap");
      setProductType(selectedTemplate.productType);
      setDescription(selectedTemplate.description);
      setSteps(selectedTemplate.steps);
      setCompletionRules(selectedTemplate.completionRules);
    } else {
      setSchemaName("");
      setWoType("new_installation");
      setMaintenanceSubtype("hardware_swap");
      setProductType("");
      setDescription("");
      setSteps([]);
      setCompletionRules({ blockBastUntilAllRequired: true, allowSkipOptionalWithNote: false, resolutionLogFromSteps: false });
    }
    setActiveTab("builder");
  }, [selectedTemplate, sheetOpen]);

  const handleSave = () => {
    const payload = {
      schema_name: schemaName,
      wo_type: woType,
      ...(woType === "maintenance" ? { maintenance_subtype: maintenanceSubtype } : {}),
      product_type: productType,
      description,
      steps: steps.map((s) => ({
        step_id: s.stepId,
        order: s.order,
        title: s.title,
        instruction_markdown: s.instructionMarkdown,
        required: s.required,
        when: s.when || undefined,
        captures: s.captures.map((c) => ({
          capture_id: c.captureId,
          type: c.type,
          label: c.label,
          required: c.required,
          constraints: Object.keys(c.constraints).length ? c.constraints : undefined,
        })),
      })),
      completion_rules: {
        block_bast_until_all_required: completionRules.blockBastUntilAllRequired,
        allow_skip_optional_with_note: completionRules.allowSkipOptionalWithNote,
        resolution_log_from_steps: completionRules.resolutionLogFromSteps,
      },
    };

    if (isNew) {
      createTemplate.mutate(payload, { onSuccess: closeSheet });
    } else if (isEdit && selectedTemplate) {
      updateTemplate.mutate({ id: selectedTemplate.id, payload }, { onSuccess: closeSheet });
    }
  };

  const TABS: { id: TabId; label: string }[] = [
    { id: "builder", label: "Builder" },
    { id: "rules", label: "Completion Rules" },
    { id: "versions", label: "Version History" },
  ];

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-4 lg:end-6 start-auto h-full sm:max-h-[calc(100vh-32px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[700px] lg:w-[820px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4 shrink-0">
          <SheetTitle className="font-medium text-xl">
            {isNew ? "New Checklist Template" : isEdit ? "Edit Template" : "Template Details"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-hidden p-0 flex flex-col">
          {/* Meta fields */}
          <div className="px-5 py-4 border-b grid grid-cols-2 gap-4 shrink-0">
            <div className="space-y-1">
              <Label className="text-xs">Schema Name <span className="text-destructive">*</span></Label>
              <Input value={schemaName} onChange={(e) => setSchemaName(e.target.value)} placeholder="e.g. Broadband New Installation" disabled={isDetail} className="h-8" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Product Type <span className="text-destructive">*</span></Label>
              <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="e.g. broadband" disabled={isDetail} className="h-8" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">WO Type <span className="text-destructive">*</span></Label>
              <Select value={woType} onValueChange={(v) => setWoType(v as WoType)} disabled={isDetail}>
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WO_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{WO_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {woType === "maintenance" && (
              <div className="space-y-1">
                <Label className="text-xs">Maintenance Subtype</Label>
                <Select value={maintenanceSubtype} onValueChange={(v) => setMaintenanceSubtype(v as MaintenanceSubtype)} disabled={isDetail}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_SUBTYPES.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={isDetail} className="text-xs resize-none" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b px-5 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="px-5 py-4">
              {/* Builder tab */}
              {activeTab === "builder" && (
                <StepsBuilder steps={steps} isDetail={isDetail} onChange={setSteps} />
              )}

              {/* Completion Rules tab */}
              {activeTab === "rules" && (
                <div className="space-y-4">
                  {(
                    [
                      { key: "blockBastUntilAllRequired" as const, label: "Block BAST until all required captures are complete", description: "Technician cannot submit BAST if any required capture is missing." },
                      { key: "allowSkipOptionalWithNote" as const, label: "Allow skipping optional captures with a note", description: "Technician can skip optional captures if they provide a reason." },
                      { key: "resolutionLogFromSteps" as const, label: "Treat steps as resolution log items", description: "Each step generates a resolution log entry on BAST submission." },
                    ] as const
                  ).map(({ key, label, description }) => (
                    <div key={key} className="flex items-start gap-3 rounded-lg border p-4">
                      <input
                        type="checkbox"
                        id={key}
                        checked={completionRules[key]}
                        onChange={(e) => setCompletionRules((prev) => ({ ...prev, [key]: e.target.checked }))}
                        disabled={isDetail}
                        className="size-4 mt-0.5"
                      />
                      <div>
                        <label htmlFor={key} className="text-sm font-medium cursor-pointer">{label}</label>
                        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Version History tab */}
              {activeTab === "versions" && (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  {selectedTemplate
                    ? `Version ${selectedTemplate.schemaVersion} — see the Versioning & Publish page for full history and approval workflow.`
                    : "Save the template first to access version history."}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 shrink-0">
          <Button variant="ghost" onClick={closeSheet}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeSheet} disabled={isPending}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isDetail || isPending || !schemaName || !productType}
            className="font-semibold"
          >
            {isPending ? "Saving..." : isNew ? "Create Template" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
