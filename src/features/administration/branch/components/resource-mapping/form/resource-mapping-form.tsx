"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RiBuildingLine,
  RiInformationLine,
  RiUserLine,
} from "@remixicon/react";
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
import { useResourceMappingStore } from "../../../store/resource-mapping";

interface ResourceMappingFormProps {
  onSubmit?: () => void;
}

export function ResourceMappingForm({ onSubmit }: ResourceMappingFormProps) {
  const { form, selectedMapping } = useResourceMappingStore();
  const isDetailMode = form === "details";

  const [resourceType, setResourceType] = useState("sales_rep");
  const [resourceName, setResourceName] = useState("");
  const [resourceCode, setResourceCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [scopeLevel, setScopeLevel] = useState("area");
  const [servesMultiple, setServesMultiple] = useState("false");
  const [additionalBranches, setAdditionalBranches] = useState("");
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    if (selectedMapping && (form === "edit" || form === "details")) {
      const m = selectedMapping;
      setResourceType(m.resourceType);
      setResourceName(m.resourceName);
      setResourceCode(m.resourceCode);
      setBranchName(m.branchName);
      setScopeLevel(m.scopeLevel);
      setServesMultiple(m.servesMultiple ? "true" : "false");
      setAdditionalBranches(m.additionalBranches.join(", "));
      setIsActive(m.isActive ? "true" : "false");
    } else if (form === "new") {
      setResourceType("sales_rep");
      setResourceName("");
      setResourceCode("");
      setBranchName("");
      setScopeLevel("area");
      setServesMultiple("false");
      setAdditionalBranches("");
      setIsActive("true");
    }
  }, [selectedMapping, form]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__resourceMappingFormSubmit = handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__resourceMappingFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* Resource Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiUserLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Resource Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Resource Type <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input value={resourceType} disabled />
                ) : (
                  <Select value={resourceType} onValueChange={setResourceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales_rep">Sales Rep</SelectItem>
                      <SelectItem value="team_leader">Team Leader</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="noc">NOC</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                {isDetailMode ? (
                  <Input value={isActive === "true" ? "Active" : "Inactive"} disabled />
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

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Resource Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Budi Santoso / Gudang Utama DKI"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Resource Code</Label>
              <Input
                placeholder="e.g. EMP-SR-001 / WH-REG-001"
                value={resourceCode}
                onChange={(e) => setResourceCode(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
          </div>

          {/* Branch Assignment */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiBuildingLine className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Branch Assignment</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Primary Branch <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Jakarta Timur"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Scope Level</Label>
                {isDetailMode ? (
                  <Input value={scopeLevel} disabled />
                ) : (
                  <Select value={scopeLevel} onValueChange={setScopeLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                      <SelectItem value="sub_area">Sub Area</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Serves Multiple Branches</Label>
              {isDetailMode ? (
                <Input value={servesMultiple === "true" ? "Yes" : "No"} disabled />
              ) : (
                <Select value={servesMultiple} onValueChange={setServesMultiple}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No — Single branch only</SelectItem>
                    <SelectItem value="true">Yes — Shared across branches</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {servesMultiple === "true" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Additional Branches</Label>
                <Textarea
                  placeholder="e.g. Jakarta Barat, Jakarta Pusat"
                  className="min-h-[60px] resize-none"
                  value={additionalBranches}
                  onChange={(e) => setAdditionalBranches(e.target.value)}
                  disabled={isDetailMode}
                />
                {!isDetailMode && (
                  <p className="text-[11px] text-muted-foreground">
                    Comma-separated list of additional branches this resource serves.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
