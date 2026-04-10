"use client";

import { useState } from "react";
import {
  RiInformationLine,
  RiOrganizationChart,
  RiShieldLine,
  RiUserSettingsLine,
  RiAddLine,
  RiDeleteBinLine,
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
import { Button } from "@/components/ui/button";
import { useUserStore } from "../../store/user";
import { DUMMY_ROLES } from "@/features/administration/roles/data/dummy-roles";
import { DUMMY_BRANCHES } from "@/features/administration/branch/data/dummy-branch";

interface RoleAssignmentRow {
  id: string;
  roleId: string;
  branchId: string;
}

export function UserForm() {
  const { form } = useUserStore();
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const [fullName, setFullName] = useState(isEditMode || isDetailMode ? "Eko Wahyudi" : "");
  const [email, setEmail] = useState(isEditMode || isDetailMode ? "eko.wahyudi@ion.id" : "");
  const [employeeId, setEmployeeId] = useState(isEditMode || isDetailMode ? "EMP-005" : "");
  const [phone, setPhone] = useState(isEditMode || isDetailMode ? "+62 812 0001 0005" : "");
  const [department, setDepartment] = useState(isEditMode || isDetailMode ? "Sales" : "");
  const [position, setPosition] = useState(isEditMode || isDetailMode ? "Sales Representative" : "");
  const [homeBranchId, setHomeBranchId] = useState(isEditMode || isDetailMode ? "br-004" : "");
  const [status, setStatus] = useState(isEditMode || isDetailMode ? "active" : "active");
  const [roleRows, setRoleRows] = useState<RoleAssignmentRow[]>(
    isEditMode || isDetailMode
      ? [{ id: "row-1", roleId: "role-001", branchId: "br-004" }]
      : [{ id: "row-1", roleId: "", branchId: "" }]
  );

  const addRoleRow = () => {
    setRoleRows([...roleRows, { id: `row-${Date.now()}`, roleId: "", branchId: "" }]);
  };

  const removeRoleRow = (id: string) => {
    if (roleRows.length <= 1) return;
    setRoleRows(roleRows.filter((r) => r.id !== id));
  };

  const updateRoleRow = (id: string, field: "roleId" | "branchId", value: string) => {
    setRoleRows(roleRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* Section 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Eko Wahyudi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="e.g. eko@ion.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Employee ID</Label>
                <Input
                  placeholder="e.g. EMP-005"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                <Input
                  placeholder="+62 812 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Organization */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiOrganizationChart className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Organization</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Department</Label>
                <Input
                  placeholder="e.g. Sales"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Position</Label>
                <Input
                  placeholder="e.g. Sales Representative"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Home Branch <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input
                    value={DUMMY_BRANCHES.find((b) => b.id === homeBranchId)?.name ?? ""}
                    disabled
                  />
                ) : (
                  <Select value={homeBranchId} onValueChange={setHomeBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select home branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {DUMMY_BRANCHES.filter((b) => b.active).map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Role Assignments */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldLine className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Role Assignments</h3>
            </div>
            <div className="space-y-3">
              {roleRows.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    {isDetailMode ? (
                      <Input
                        value={DUMMY_ROLES.find((r) => r.id === row.roleId)?.name ?? ""}
                        disabled
                      />
                    ) : (
                      <Select
                        value={row.roleId}
                        onValueChange={(val) => updateRoleRow(row.id, "roleId", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {DUMMY_ROLES.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex-1">
                    {isDetailMode ? (
                      <Input
                        value={DUMMY_BRANCHES.find((b) => b.id === row.branchId)?.name ?? ""}
                        disabled
                      />
                    ) : (
                      <Select
                        value={row.branchId}
                        onValueChange={(val) => updateRoleRow(row.id, "branchId", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {DUMMY_BRANCHES.filter((b) => b.active).map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {!isDetailMode && (
                    <Button
                      type="button"
                      mode="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRoleRow(row.id)}
                      disabled={roleRows.length <= 1}
                    >
                      <RiDeleteBinLine />
                    </Button>
                  )}
                </div>
              ))}
              {!isDetailMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRoleRow}
                  className="mt-1"
                >
                  <RiAddLine />
                  Add Role Assignment
                </Button>
              )}
            </div>
          </div>

          {/* Section 4: Account */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiUserSettingsLine className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold">Account</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                {isDetailMode ? (
                  <Input
                    value={status.charAt(0).toUpperCase() + status.slice(1)}
                    disabled
                  />
                ) : (
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
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
