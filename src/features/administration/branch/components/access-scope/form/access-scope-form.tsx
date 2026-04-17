"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RiInformationLine,
  RiLockLine,
  RiMapPinLine,
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
import { useAccessScopeStore } from "../../../store/access-scope";
import { useBranchList } from "../../../api/branch-queries";

interface AccessScopeFormProps {
  onSubmit?: () => void;
}

export function AccessScopeForm({ onSubmit }: AccessScopeFormProps) {
  const { form, selectedScope } = useAccessScopeStore();
  const { data: branchList = [], isLoading: branchListLoading } = useBranchList();
  const isDetailMode = form === "details";

  const [subjectType, setSubjectType] = useState("role");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [scopeLevel, setScopeLevel] = useState("area");
  const [branchScope, setBranchScope] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState("read");
  const [canCrossBranch, setCanCrossBranch] = useState("false");
  const [isActive, setIsActive] = useState("true");

  useEffect(() => {
    if (selectedScope && (form === "edit" || form === "details")) {
      const s = selectedScope;
      setSubjectType(s.subjectType);
      setSubjectName(s.subjectName);
      setSubjectCode(s.subjectCode);
      setScopeLevel(s.scopeLevel);
      setBranchScope(s.branchScope);
      setPermissionLevel(s.permissionLevel);
      setCanCrossBranch(s.canCrossBranch ? "true" : "false");
      setIsActive(s.isActive ? "true" : "false");
    } else if (form === "new") {
      setSubjectType("role");
      setSubjectName("");
      setSubjectCode("");
      setScopeLevel("area");
      setBranchScope([]);
      setPermissionLevel("read");
      setCanCrossBranch("false");
      setIsActive("true");
    }
  }, [selectedScope, form]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__accessScopeFormSubmit = handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__accessScopeFormSubmit;
    };
  }, [handleSubmit]);

  // Filter by active, then by selected scope level
  const filteredBranches = branchList.filter((b) => {
    if (!b.active) return false;
    if (scopeLevel === "all") return true;
    return b.level === scopeLevel;
  });

  const branchOptions = filteredBranches.map((b) => ({
    value: b.name,
    label: b.name,
    level: b.level,
  }));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          {/* Subject Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Subject Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Subject Type <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input value={subjectType} disabled />
                ) : (
                  <Select value={subjectType} onValueChange={setSubjectType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="role">Role</SelectItem>
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
                {subjectType === "user" ? "User Name" : "Role Name"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={subjectType === "user" ? "e.g. Rina Wulandari" : "e.g. Area Manager"}
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Code / Identifier</Label>
              <Input
                placeholder="e.g. EMP-OPS-045 / ROLE-AREA-MGR"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
          </div>

          {/* Branch Scope */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPinLine className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Branch Scope</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Scope Level</Label>
              {isDetailMode ? (
                <Input value={scopeLevel} disabled />
              ) : (
                <Select
                  value={scopeLevel}
                  onValueChange={(v) => { setScopeLevel(v); setBranchScope([]); }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="sub_area">Sub Area</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Assigned Branches</Label>
              {isDetailMode ? (
                <Input value={branchScope.join(", ")} disabled />
              ) : (
                <div className={scopeLevel === "all" ? "pointer-events-none opacity-50" : undefined}>
                  <MultiSelect
                    value={branchScope}
                    onChange={setBranchScope}
                    options={branchOptions}
                    placeholder={scopeLevel === "all" ? "All branches — no restriction" : "Select branches"}
                    filteredText="branches"
                    isLoading={branchListLoading}
                    emptyText="No branches found"
                  />
                </div>
              )}
              {!isDetailMode && scopeLevel !== "all" && (
                <p className="text-[11px] text-muted-foreground">
                  Leave empty to grant access to all branches at the selected scope level.
                </p>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiLockLine className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Permission Settings</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Permission Level</Label>
                {isDetailMode ? (
                  <Input value={permissionLevel} disabled />
                ) : (
                  <Select value={permissionLevel} onValueChange={setPermissionLevel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read — View only</SelectItem>
                      <SelectItem value="write">Write — Create & edit</SelectItem>
                      <SelectItem value="admin">Admin — Full branch control</SelectItem>
                      <SelectItem value="full">Full — Unrestricted access</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Cross-branch Access</Label>
                {isDetailMode ? (
                  <Input value={canCrossBranch === "true" ? "Allowed" : "Restricted"} disabled />
                ) : (
                  <Select value={canCrossBranch} onValueChange={setCanCrossBranch}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Restricted — Own branch only</SelectItem>
                      <SelectItem value="true">Allowed — Can access other branches</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
