"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RiBuildingLine,
  RiInformationLine,
  RiUserLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResourceMappingStore } from "../../../store/resource-mapping";
import { useBranchList } from "../../../api/branch-queries";

interface ResourceMappingFormProps {
  onSubmit?: () => void;
}

export function ResourceMappingForm({ onSubmit }: ResourceMappingFormProps) {
  const { form, selectedMapping } = useResourceMappingStore();
  const { data: branchList = [], isLoading: branchListLoading } = useBranchList();
  const isDetailMode = form === "details";

  const [resourceType, setResourceType] = useState("sales_rep");
  const [resourceName, setResourceName] = useState("");
  const [resourceCode, setResourceCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [servesMultiple, setServesMultiple] = useState("false");
  const [additionalBranches, setAdditionalBranches] = useState<string[]>([]);
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    if (selectedMapping && (form === "edit" || form === "details")) {
      const m = selectedMapping;
      setResourceType(m.resourceType);
      setResourceName(m.resourceName);
      setResourceCode(m.resourceCode);
      setBranchName(m.branchName);
      setServesMultiple(m.servesMultiple ? "true" : "false");
      setAdditionalBranches(m.additionalBranches);
      setIsActive(m.isActive ? "true" : "false");
    } else if (form === "new") {
      setResourceType("sales_rep");
      setResourceName("");
      setResourceCode("");
      setBranchName("");
      setServesMultiple("false");
      setAdditionalBranches([]);
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

  const activeBranches = branchList.filter((b) => b.active);

  const branchOptions = activeBranches.map((b) => ({
    value: b.name,
    label: b.name,
    level: b.level,
  }));

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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Primary Branch <span className="text-red-500">*</span>
              </Label>
              {isDetailMode ? (
                <Input value={branchName} disabled />
              ) : (
                <Select value={branchName} onValueChange={setBranchName} disabled={branchListLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={branchListLoading ? "Loading branches…" : "Select branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBranches.map((b) => (
                      <SelectItem key={b.id} value={b.name}>
                        <span>{b.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground capitalize">
                          {b.level.replace("_", " ")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Serves Multiple Branches</Label>
              {isDetailMode ? (
                <Input value={servesMultiple === "true" ? "Yes" : "No"} disabled />
              ) : (
                <Select
                  value={servesMultiple}
                  onValueChange={(v) => { setServesMultiple(v); if (v === "false") setAdditionalBranches([]); }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                {isDetailMode ? (
                  <Input value={additionalBranches.join(", ")} disabled />
                ) : (
                  <MultiSelect
                    value={additionalBranches}
                    onChange={setAdditionalBranches}
                    options={branchOptions}
                    placeholder="Select additional branches"
                    filteredText="branches"
                    isLoading={branchListLoading}
                    emptyText="No branches found"
                  />
                )}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
