"use client";

import { useEffect, useState } from "react";
import { RiInformationLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCapabilityStore } from "../../../store/capability";
import { CapabilityPayload } from "../../../types/capability-api";

interface CapabilityFormProps {
  onSubmit?: (payload: CapabilityPayload) => void;
}

export function CapabilityForm({ onSubmit }: CapabilityFormProps) {
  const { form, selectedCapability } = useCapabilityStore();
  const isDetailMode = form === "details";
  const isEditMode = form === "edit";

  const [capabilityKey, setCapabilityKey] = useState("");
  const [description, setDescription] = useState("");
  const [isEnabled, setIsEnabled] = useState("true");

  useEffect(() => {
    if (selectedCapability && (isEditMode || isDetailMode)) {
      setCapabilityKey(selectedCapability.capabilityKey);
      setDescription(selectedCapability.description);
      setIsEnabled(selectedCapability.isEnabled ? "true" : "false");
    }
  }, [selectedCapability, isEditMode, isDetailMode]);

  const handleSubmit = () => {
    if (!onSubmit) return;
    onSubmit({
      capability_key: capabilityKey,
      description,
      is_enabled: isEnabled === "true",
    });
  };

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__capabilityFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>)
        .__capabilityFormSubmit;
    };
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Capability Information</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Capability Key <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. broadband_installation"
                value={capabilityKey}
                onChange={(e) =>
                  setCapabilityKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))
                }
                disabled={isDetailMode || isEditMode}
                className="font-mono"
              />
              {!isDetailMode && !isEditMode && (
                <p className="text-[11px] text-muted-foreground">
                  Use snake_case. Cannot be changed after creation.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              {isDetailMode ? (
                <Input
                  value={isEnabled === "true" ? "Enabled" : "Disabled"}
                  disabled
                />
              ) : (
                <Select value={isEnabled} onValueChange={setIsEnabled}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                placeholder="Describe what this capability enables for the branch..."
                className="min-h-[80px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
