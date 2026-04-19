"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Capture, CaptureType } from "../../../types/checklist-template";
import { CAPTURE_TYPE_LABELS } from "../../../types/checklist-template";

const CAPTURE_TYPES: CaptureType[] = [
  "text",
  "photo",
  "barcode_scan",
  "qr_scan",
  "signature",
  "file_upload",
  "number",
  "checkbox",
  "select",
];

const PHOTO_TAGS = ["before", "after", "component", "serial_number"];

interface CaptureRowProps {
  capture: Capture;
  isDetail: boolean;
  onChange: (c: Capture) => void;
  onRemove: () => void;
}

function CaptureRow({ capture, isDetail, onChange, onRemove }: CaptureRowProps) {
  const [expanded, setExpanded] = useState(false);

  const update = (patch: Partial<Capture>) => onChange({ ...capture, ...patch });
  const updateConstraint = (patch: object) =>
    onChange({ ...capture, constraints: { ...capture.constraints, ...patch } });

  return (
    <div className="rounded-md border bg-background">
      <div className="flex items-center gap-2 px-3 py-2">
        <Badge variant="secondary" appearance="light" className="text-xs shrink-0">
          {CAPTURE_TYPE_LABELS[capture.type]}
        </Badge>
        <Input
          value={capture.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Capture label"
          className="h-7 text-xs flex-1"
          disabled={isDetail}
        />
        <div className="flex items-center gap-1 shrink-0">
          <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={capture.required}
              onChange={(e) => update({ required: e.target.checked })}
              disabled={isDetail}
              className="size-3"
            />
            Required
          </label>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </Button>
          {!isDetail && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={onRemove}>
              <Trash2 className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t px-3 py-2.5 space-y-2 bg-muted/20">
          {capture.type === "photo" && (
            <>
              <div className="flex items-center gap-3">
                <Label className="text-xs w-20 shrink-0">Min photos</Label>
                <Input type="number" value={capture.constraints.min_count ?? ""} onChange={(e) => updateConstraint({ min_count: Number(e.target.value) })} className="h-6 w-20 text-xs" disabled={isDetail} />
                <Label className="text-xs w-20 shrink-0">Max photos</Label>
                <Input type="number" value={capture.constraints.max_count ?? ""} onChange={(e) => updateConstraint({ max_count: Number(e.target.value) })} className="h-6 w-20 text-xs" disabled={isDetail} />
              </div>
              <div>
                <Label className="text-xs">Tags</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PHOTO_TAGS.map((tag) => {
                    const selected = (capture.constraints.tags ?? []).includes(tag);
                    return (
                      <button
                        key={tag}
                        disabled={isDetail}
                        onClick={() => {
                          const tags = capture.constraints.tags ?? [];
                          updateConstraint({ tags: selected ? tags.filter((t) => t !== tag) : [...tags, tag] });
                        }}
                        className={`px-2 py-0.5 rounded text-xs border transition-colors ${selected ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {capture.type === "file_upload" && (
            <div className="flex items-center gap-3">
              <Label className="text-xs w-28 shrink-0">Accepted formats</Label>
              <Input value={(capture.constraints.accepted_formats ?? []).join(", ")} onChange={(e) => updateConstraint({ accepted_formats: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="jpg, png, pdf" className="h-6 text-xs flex-1" disabled={isDetail} />
              <Label className="text-xs shrink-0">Max MB</Label>
              <Input type="number" value={capture.constraints.max_size_mb ?? ""} onChange={(e) => updateConstraint({ max_size_mb: Number(e.target.value) })} className="h-6 w-16 text-xs" disabled={isDetail} />
            </div>
          )}
          {capture.type === "signature" && (
            <div className="flex items-center gap-3">
              <Label className="text-xs w-24 shrink-0">Signer role</Label>
              <Select value={capture.constraints.signer_role ?? "customer"} onValueChange={(v) => updateConstraint({ signer_role: v })} disabled={isDetail}>
                <SelectTrigger className="h-6 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="enterprise_pic">Enterprise PIC</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" checked={!!capture.constraints.allow_remote_otp} onChange={(e) => updateConstraint({ allow_remote_otp: e.target.checked })} disabled={isDetail} className="size-3" />
                Allow Remote OTP
              </label>
            </div>
          )}
          {(capture.type === "barcode_scan" || capture.type === "qr_scan") && (
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={!!capture.constraints.must_match_reserved_asset} onChange={(e) => updateConstraint({ must_match_reserved_asset: e.target.checked })} disabled={isDetail} className="size-3" />
              Must match reserved asset
            </label>
          )}
          {capture.type === "text" && (
            <div className="flex items-center gap-3">
              <Label className="text-xs w-20 shrink-0">Max length</Label>
              <Input type="number" value={capture.constraints.max_length ?? ""} onChange={(e) => updateConstraint({ max_length: Number(e.target.value) })} className="h-6 w-20 text-xs" disabled={isDetail} />
            </div>
          )}
          {capture.type === "number" && (
            <div className="flex items-center gap-3">
              <Label className="text-xs w-10 shrink-0">Min</Label>
              <Input type="number" value={capture.constraints.min ?? ""} onChange={(e) => updateConstraint({ min: Number(e.target.value) })} className="h-6 w-20 text-xs" disabled={isDetail} />
              <Label className="text-xs w-10 shrink-0">Max</Label>
              <Input type="number" value={capture.constraints.max ?? ""} onChange={(e) => updateConstraint({ max: Number(e.target.value) })} className="h-6 w-20 text-xs" disabled={isDetail} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CaptureEditorProps {
  captures: Capture[];
  isDetail: boolean;
  onChange: (captures: Capture[]) => void;
}

export function CaptureEditor({ captures, isDetail, onChange }: CaptureEditorProps) {
  const [addType, setAddType] = useState<CaptureType>("photo");

  const addCapture = () => {
    const newCapture: Capture = {
      captureId: `cap_${Date.now()}`,
      type: addType,
      label: "",
      required: true,
      constraints: {},
    };
    onChange([...captures, newCapture]);
  };

  const updateCapture = (idx: number, c: Capture) => {
    const next = [...captures];
    next[idx] = c;
    onChange(next);
  };

  const removeCapture = (idx: number) => {
    onChange(captures.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {captures.map((c, i) => (
        <CaptureRow
          key={c.captureId}
          capture={c}
          isDetail={isDetail}
          onChange={(updated) => updateCapture(i, updated)}
          onRemove={() => removeCapture(i)}
        />
      ))}
      {!isDetail && (
        <div className="flex items-center gap-2 mt-2">
          <Select value={addType} onValueChange={(v) => setAddType(v as CaptureType)}>
            <SelectTrigger className="h-7 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CAPTURE_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{CAPTURE_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={addCapture}>
            <Plus className="size-3.5" />
            Add Capture
          </Button>
        </div>
      )}
    </div>
  );
}
