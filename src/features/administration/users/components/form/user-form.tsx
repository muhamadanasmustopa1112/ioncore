"use client";

import { useEffect, useState } from "react";
import {
  RiInformationLine,
  RiOrganizationChart,
  RiShieldLine,
  RiUserSettingsLine,
  RiAddLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
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
import { useRoles } from "@/features/user-service/api/roles";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import type { BranchData } from "@/features/administration/branch/types/branch";
import { useCreateUser, useUpdateUser, useAssignUserRoles, useUserSessions, useRevokeUserSessions } from "@/features/user-service/api/users";
import { getPasswordRules, isPasswordValid } from "@/lib/password";
import { Monitor, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function PwRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      }`}
    >
      {ok ? <Check className="size-3" /> : <X className="size-3" />}
      <span>{label}</span>
    </li>
  );
}

interface RoleAssignmentRow {
  id: string;
  roleId: string;
  branchId: string;
}

export function UserForm() {
  const { form, selectedUser, closeUserFormSheet } = useUserStore();
  const isNewMode = form === "new";
  const isDetailMode = form === "details";

  const { data: rolesResp } = useRoles({ per_page: 100 });
  const { data: branchList } = useBranchList({ per_page: 100 });
  const roles = rolesResp?.data || [];
  const branches: BranchData[] = branchList ?? [];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [homeBranchId, setHomeBranchId] = useState("");
  const [roleRows, setRoleRows] = useState<RoleAssignmentRow[]>([
    { id: "row-1", roleId: "", branchId: "" },
  ]);

  useEffect(() => {
    if (selectedUser) {
      setFullName(selectedUser.fullName);
      setEmail(selectedUser.email);
      setPhone(selectedUser.phone ?? "");
      setDepartment(selectedUser.department ?? "");
      setPosition(selectedUser.position ?? "");
      setHomeBranchId(selectedUser.homeBranchId ?? "");
      setRoleRows(
        selectedUser.roleAssignments.length > 0
          ? selectedUser.roleAssignments.map((r, i) => ({
              id: `row-${i}`,
              roleId: r.roleId,
              branchId: r.branchId,
            }))
          : [{ id: "row-0", roleId: "", branchId: "" }],
      );
    } else {
      setFullName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setPosition("");
      setHomeBranchId("");
      setPassword("");
      setRoleRows([{ id: "row-1", roleId: "", branchId: "" }]);
    }
  }, [selectedUser]);

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

  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignUserRoles();
  const { data: sessionsResp } = useUserSessions(selectedUser?.id ?? "", { active_only: true });
  const { mutateAsync: revokeSessions, isPending: isRevoking } = useRevokeUserSessions();
  const sessions = Array.isArray(sessionsResp?.data) ? sessionsResp.data : [];
  const isPending = isCreating || isUpdating || isAssigning;

  const pwRules = getPasswordRules(password);
  const pwValid = isPasswordValid(password);

  const handleSave = async () => {
    if (isDetailMode) { closeUserFormSheet(); return; }

    if (!isNewMode && selectedUser) {
      try {
        await updateUser({
          id: selectedUser.id,
          payload: {
            name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            job_title: position.trim() || undefined,
            unit_kerja: department.trim() || undefined,
            home_branch_id: homeBranchId || undefined,
          },
        });
        const role_ids = Array.from(new Set(roleRows.map((r) => r.roleId).filter(Boolean)));
        if (role_ids.length) {
          await assignRoles({ id: selectedUser.id, payload: { role_ids } });
        }
        toast.success("User updated");
        closeUserFormSheet();
      } catch (err: unknown) {
        toast.error(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update user",
        );
      }
      return;
    }

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Name, email, and password are required");
      return;
    }
    if (!pwValid) {
      toast.error("Password does not meet requirements");
      return;
    }
    const role_ids = Array.from(
      new Set(roleRows.map((r) => r.roleId).filter(Boolean)),
    );
    const branch_ids = Array.from(
      new Set(
        [...roleRows.map((r) => r.branchId), homeBranchId].filter(Boolean),
      ),
    );
    try {
      await createUser({
        name: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        job_title: position.trim() || undefined,
        unit_kerja: department.trim() || undefined,
        home_branch_id: homeBranchId || undefined,
        role_ids: role_ids.length ? role_ids : undefined,
        branch_ids: branch_ids.length ? branch_ids : undefined,
      });
      toast.success("User created");
      closeUserFormSheet();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create user",
      );
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
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
              {isNewMode && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="Temporary password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <ul className="mt-1.5 space-y-1 text-[11px]">
                    <PwRule ok={pwRules.length} label="Min 8 characters" />
                    <PwRule ok={pwRules.uppercase} label="Min 1 uppercase letter" />
                    <PwRule ok={pwRules.lowercase} label="Min 1 lowercase letter" />
                    <PwRule ok={pwRules.special} label="Min 1 special character" />
                    <PwRule ok={pwRules.noSpace} label="No spaces" />
                  </ul>
                </div>
              )}
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
                  Home Branch
                </Label>
                <Select
                  value={homeBranchId}
                  onValueChange={setHomeBranchId}
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldLine className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Role Assignments</h3>
            </div>
            <div className="space-y-3">
              {roleRows.map((row) => {
                const roleName = roles.find((r) => r.id === row.roleId)?.name ?? "";
                const isTechRole = /technician|technical/i.test(roleName);
                const filteredBranches = isTechRole
                  ? branches.filter((b) => b.branchType === "noc")
                  : branches;
                return (
                <div key={row.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      value={row.roleId}
                      onValueChange={(val) => updateRoleRow(row.id, "roleId", val)}
                      disabled={isDetailMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select
                      value={row.branchId}
                      onValueChange={(val) => updateRoleRow(row.id, "branchId", val)}
                      disabled={isDetailMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBranches.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              );})}
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

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiUserSettingsLine className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold">Account</h3>
            </div>
            <p className="text-[11px] text-muted-foreground">
              User status and lock state can be managed from the user list actions after creation.
            </p>
          </div>

          {isDetailMode && selectedUser && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Monitor className="size-4 text-orange-500" />
                  <h3 className="text-sm font-semibold">Active Sessions</h3>
                  {sessions.length > 0 && (
                    <Badge variant="warning" appearance="light" size="sm">{sessions.length}</Badge>
                  )}
                </div>
                {sessions.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/5 h-7 text-xs"
                    onClick={async () => {
                      try {
                        await revokeSessions(selectedUser.id);
                        toast.success("All sessions revoked");
                      } catch {
                        toast.error("Failed to revoke sessions");
                      }
                    }}
                    disabled={isRevoking}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Revoke All
                  </Button>
                )}
              </div>
              {sessions.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">No active sessions</p>
              ) : (
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.id} className="rounded-md border border-border/60 px-3 py-2 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-muted-foreground">{s.ip_address ?? "Unknown IP"}</span>
                        <Badge variant={s.is_active ? "success" : "secondary"} appearance="light" size="sm">
                          {s.is_active ? "active" : "expired"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground truncate">{s.user_agent ?? "—"}</p>
                      <p className="text-muted-foreground">
                        Created: {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-border flex flex-row items-center gap-2.5 border-t p-5 pb-4">
        <Button variant="ghost" onClick={closeUserFormSheet} disabled={isPending}>
          Close
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          onClick={closeUserFormSheet}
          disabled={isPending}
          className="mr-3"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isDetailMode || isPending}
          className="font-semibold"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isNewMode ? "Create User" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
