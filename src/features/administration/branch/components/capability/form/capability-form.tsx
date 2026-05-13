"use client";

import { useCallback, useEffect, useState } from "react";
import { RiInformationLine, RiSettings3Line } from "@remixicon/react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCapabilityStore } from "../../../store/capability";
import { CapabilityJson, CapabilityPayload } from "../../../types/capability-api";

const CAPABILITY_LABELS: Record<keyof CapabilityJson, string> = {
  sales: "Sales",
  helpdesk: "Helpdesk",
  dispatch: "Dispatch",
  stock_holding: "Stock Holding",
  monitoring: "Monitoring",
  collection: "Collection",
  approval: "Approval",
  auto_assignment: "Auto Assignment",
};

const DEFAULT_JSON: CapabilityJson = {
  sales: false,
  helpdesk: false,
  dispatch: false,
  stock_holding: false,
  monitoring: false,
  collection: false,
  approval: false,
  auto_assignment: false,
};

interface CapabilityFormProps {
  onSubmit?: (payload: CapabilityPayload) => void;
}

export function CapabilityForm({ onSubmit }: CapabilityFormProps) {
  const { form, selectedCapability } = useCapabilityStore();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [capJson, setCapJson] = useState<CapabilityJson>({ ...DEFAULT_JSON });

  useEffect(() => {
    if (selectedCapability && (form === "edit" || form === "details")) {
      setName(selectedCapability.name);
      setDescription(selectedCapability.description);
      setIsActive(selectedCapability.isActive ? "true" : "false");
      setCapJson(selectedCapability.capabilityJson ?? { ...DEFAULT_JSON });
    } else if (form === "new") {
      setName("");
      setDescription("");
      setIsActive("true");
      setCapJson({ ...DEFAULT_JSON });
    }
  }, [selectedCapability, form]);

  const toggleCap = (key: keyof CapabilityJson) => {
    setCapJson((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return;
    onSubmit({ name, description, is_active: isActive === "true", capability_json: capJson });
  }, [name, description, isActive, capJson, onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__capabilityFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__capabilityFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General Information</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Full Capability"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                placeholder="Describe what this capability set enables for the branch..."
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              {isDetailMode ? (
                <Input
                  value={isActive === "true" ? "Active" : "Inactive"}
                  disabled
                />
              ) : (
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Capability Flags */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiSettings3Line className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Feature Flags</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(CAPABILITY_LABELS) as Array<keyof CapabilityJson>).map(
                (key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 bg-muted/20"
                  >
                    <span className="text-sm font-medium">
                      {CAPABILITY_LABELS[key]}
                    </span>
                    <Switch
                      checked={capJson[key]}
                      onCheckedChange={() => !isDetailMode && toggleCap(key)}
                      disabled={isDetailMode}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
