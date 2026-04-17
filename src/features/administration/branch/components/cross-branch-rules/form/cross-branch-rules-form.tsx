"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RiArrowLeftRightLine,
  RiInformationLine,
  RiShieldCheckLine,
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
import { useCrossBranchRulesStore } from "../../../store/cross-branch-rules";
import { useBranchList } from "../../../api/branch-queries";

interface CrossBranchRulesFormProps {
  onSubmit?: () => void;
}

export function CrossBranchRulesForm({ onSubmit }: CrossBranchRulesFormProps) {
  const { form, selectedRule } = useCrossBranchRulesStore();
  const { data: branchList = [], isLoading: branchListLoading } = useBranchList();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ruleType, setRuleType] = useState("dispatch");
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [condition, setCondition] = useState("");
  const [requiresApproval, setRequiresApproval] = useState("true");
  const [approvalLevel, setApprovalLevel] = useState("");
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    if (selectedRule && (form === "edit" || form === "details")) {
      const r = selectedRule;
      setName(r.name);
      setDescription(r.description);
      setRuleType(r.ruleType);
      setSourceBranch(r.sourceBranch);
      setTargetBranch(r.targetBranch);
      setCondition(r.condition);
      setRequiresApproval(r.requiresApproval ? "true" : "false");
      setApprovalLevel(r.approvalLevel);
      setIsActive(r.isActive ? "true" : "false");
    } else if (form === "new") {
      setName("");
      setDescription("");
      setRuleType("dispatch");
      setSourceBranch("");
      setTargetBranch("");
      setCondition("");
      setRequiresApproval("true");
      setApprovalLevel("");
      setIsActive("true");
    }
  }, [selectedRule, form]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__crossBranchRulesFormSubmit = handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__crossBranchRulesFormSubmit;
    };
  }, [handleSubmit]);

  const activeBranches = branchList.filter((b) => b.active);

  const BranchSelect = ({
    value,
    onValueChange,
    disabled,
  }: {
    value: string;
    onValueChange: (v: string) => void;
    disabled?: boolean;
  }) => (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || branchListLoading}>
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
  );

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
                Rule Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Overflow Dispatch — Area A → Area B"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                placeholder="Describe what this rule allows..."
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Rule Type</Label>
                {isDetailMode ? (
                  <Input value={ruleType} disabled />
                ) : (
                  <Select value={ruleType} onValueChange={setRuleType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dispatch">Dispatch</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
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
          </div>

          {/* Branch Scope */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiArrowLeftRightLine className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Branch Scope</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Source Branch <span className="text-red-500">*</span>
                </Label>
                {isDetailMode
                  ? <Input value={sourceBranch} disabled />
                  : <BranchSelect value={sourceBranch} onValueChange={setSourceBranch} />
                }
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Target Branch <span className="text-red-500">*</span>
                </Label>
                {isDetailMode
                  ? <Input value={targetBranch} disabled />
                  : <BranchSelect value={targetBranch} onValueChange={setTargetBranch} />
                }
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Trigger Condition</Label>
              <Textarea
                placeholder="e.g. Queue > 5 pending WOs"
                className="min-h-[60px] resize-none"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                disabled={isDetailMode}
              />
              {!isDetailMode && (
                <p className="text-[11px] text-muted-foreground">
                  Describe the condition that triggers this cross-branch operation.
                </p>
              )}
            </div>
          </div>

          {/* Approval */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldCheckLine className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Approval Settings</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Requires Approval</Label>
                {isDetailMode ? (
                  <Input value={requiresApproval === "true" ? "Yes" : "No"} disabled />
                ) : (
                  <Select value={requiresApproval} onValueChange={setRequiresApproval}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes — Manual approval required</SelectItem>
                      <SelectItem value="false">No — Auto-allowed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Approval Level</Label>
                <Input
                  placeholder="e.g. Team Leader, NOC Manager"
                  value={approvalLevel}
                  onChange={(e) => setApprovalLevel(e.target.value)}
                  disabled={isDetailMode || requiresApproval === "false"}
                />
              </div>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
