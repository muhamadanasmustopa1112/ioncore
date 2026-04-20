"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaptureEditor } from "./capture-editor";
import type { Step, Capture } from "../../../types/checklist-template";

interface StepRowProps {
  step: Step;
  isDetail: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (s: Step) => void;
  onRemove: () => void;
}

function StepRow({ step, isDetail, isExpanded, onToggle, onChange, onRemove }: StepRowProps) {
  const update = (patch: Partial<Step>) => onChange({ ...step, ...patch });

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-3 bg-muted/30">
        {!isDetail && <GripVertical className="size-4 text-muted-foreground/50 cursor-grab shrink-0" />}
        <span className="text-xs text-muted-foreground font-mono shrink-0">#{step.order}</span>
        <Input
          value={step.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Step title"
          className="h-7 text-sm flex-1 font-medium"
          disabled={isDetail}
        />
        <div className="flex items-center gap-1 shrink-0">
          <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={step.required}
              onChange={(e) => update({ required: e.target.checked })}
              disabled={isDetail}
              className="size-3"
            />
            Required
          </label>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={onToggle}>
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
          {!isDetail && (
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={onRemove}>
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-3 space-y-3 border-t">
          <div className="space-y-1">
            <Label className="text-xs">Instructions (markdown)</Label>
            <Textarea
              value={step.instructionMarkdown}
              onChange={(e) => update({ instructionMarkdown: e.target.value })}
              placeholder="Detailed step instructions for the technician..."
              rows={2}
              disabled={isDetail}
              className="text-xs resize-none"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Condition (when to show this step)</Label>
            <Input
              value={step.when}
              onChange={(e) => update({ when: e.target.value })}
              placeholder='e.g. wo.product_type == "enterprise"'
              disabled={isDetail}
              className="h-7 text-xs font-mono"
            />
          </div>

          <div>
            <Label className="text-xs mb-2 block">
              Captures ({step.captures.length})
            </Label>
            <CaptureEditor
              captures={step.captures}
              isDetail={isDetail}
              onChange={(captures: Capture[]) => update({ captures })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface StepsBuilderProps {
  steps: Step[];
  isDetail: boolean;
  onChange: (steps: Step[]) => void;
}

export function StepsBuilder({ steps, isDetail, onChange }: StepsBuilderProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addStep = () => {
    const newStep: Step = {
      stepId: `step_${Date.now()}`,
      order: steps.length + 1,
      title: "",
      instructionMarkdown: "",
      required: true,
      when: "",
      captures: [],
    };
    const next = [...steps, newStep];
    onChange(next);
    setExpandedIds((prev) => new Set(Array.from(prev).concat(newStep.stepId)));
  };

  const updateStep = (idx: number, s: Step) => {
    const next = [...steps];
    next[idx] = s;
    onChange(next);
  };

  const removeStep = (idx: number) => {
    const next = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
    onChange(next);
  };

  return (
    <div className="space-y-2.5">
      {steps.length === 0 && !isDetail && (
        <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">
          No steps yet. Click "Add Step" to begin building the checklist.
        </p>
      )}
      {steps.map((step, i) => (
        <StepRow
          key={step.stepId}
          step={step}
          isDetail={isDetail}
          isExpanded={expandedIds.has(step.stepId)}
          onToggle={() => toggle(step.stepId)}
          onChange={(s) => updateStep(i, s)}
          onRemove={() => removeStep(i)}
        />
      ))}
      {!isDetail && (
        <Button variant="outline" size="sm" className="w-full h-9 border-dashed text-xs" onClick={addStep}>
          <Plus className="size-3.5" />
          Add Step
        </Button>
      )}
    </div>
  );
}
