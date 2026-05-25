"use client";

import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../../store/user";
import { useRoles } from "@/features/user-service/api/roles";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import type { BranchData } from "@/features/administration/branch/types/branch";
import { useUserSessions, useRevokeUserSessions, useUsers } from "@/features/user-service/api/users";
import { WorkingScope } from "../../types/user";
import { createUserFormSchema, type UserFormValues } from "./form-schema";
import { useFormSync } from "./hooks/use-form-sync";
import { useFormSubmit } from "./hooks/use-form-submit";
import { IdentitySection } from "./sections/identity-section";
import { RoleAssignmentsSection } from "./sections/role-assignments-section";
import { OrgSection } from "./sections/org-section";
import { AccountSection } from "./sections/account-section";

export function UserForm() {
  const { form: formMode, selectedUser, closeUserFormSheet } = useUserStore();
  const isNewMode = formMode === "new";
  const isDetailMode = formMode === "details";

  const { data: rolesResp } = useRoles({ per_page: 100 });
  const { data: branchList } = useBranchList({ per_page: 100 });
  const { data: usersResp } = useUsers({ per_page: 100 });
  const roles = rolesResp?.data || [];
  const branches: BranchData[] = branchList ?? [];
  const allUsers = usersResp?.data || [];

  const userOptions = useMemo(() => {
    if (!allUsers.length) return [];

    const nodes = allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      reportsToUserId: (u as any).reports_to_user_id || "",
      children: [] as any[],
    }));

    const map = new Map(nodes.map((n) => [n.id, n]));
    const roots: any[] = [];

    nodes.forEach((n) => {
      const parent = n.reportsToUserId ? map.get(n.reportsToUserId) : null;
      if (parent) {
        parent.children.push(n);
      } else {
        roots.push(n);
      }
    });

    const flattened: any[] = [];
    const walk = (n: any, level: number) => {
      flattened.push({ ...n, level });
      n.children.forEach((c: any) => walk(c, level + 1));
    };
    roots.forEach((r) => walk(r, 0));

    return flattened;
  }, [allUsers]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserFormSchema(isNewMode)),
    defaultValues: {
      fullName: selectedUser?.fullName ?? "",
      email: selectedUser?.email ?? "",
      password: "",
      phone: selectedUser?.phone ?? "",
      employeeId: selectedUser?.employeeId ?? "",
      functionName: selectedUser?.functionName ?? "",
      department: selectedUser?.department ?? "",
      position: selectedUser?.position ?? "",
      workingScope: (selectedUser?.workingScope as WorkingScope) ?? "",
      salesType: selectedUser?.salesType ?? "",
      technicianId: selectedUser?.technicianId ?? "",
      homeBranchId: selectedUser?.homeBranchId ?? "",
      activeBranchId: selectedUser?.activeBranchId ?? "",
      reportsToUserId: selectedUser?.reportsToUserId ?? "",
      roleAssignments:
        selectedUser && selectedUser.roleAssignments.length > 0
          ? selectedUser.roleAssignments.map((r) => ({
            roleId: r.roleId,
            branchId: r.branchId,
          }))
          : [{ roleId: "", branchId: "" }],
    },
  });

  useEffect(() => {
    if (!selectedUser) {
      form.reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        employeeId: "",
        functionName: "",
        department: "",
        position: "",
        workingScope: "",
        salesType: "",
        technicianId: "",
        homeBranchId: "",
        activeBranchId: "",
        reportsToUserId: "",
        roleAssignments: [{ roleId: "", branchId: "" }],
      });
    }
  }, [selectedUser, form]);

  const {
    homeBranchOptions,
    activeBranchOptions,
    workingScopeOptions,
    isSalesRole,
    lockedSalesType,
  } = useFormSync({ form, branches, roles, isDetailMode });

  const { onSubmit, isPending } = useFormSubmit({
    form,
    selectedUser,
    isNewMode,
    isDetailMode,
    closeUserFormSheet,
  });

  const { data: sessionsResp } = useUserSessions(selectedUser?.id ?? "", { active_only: true });
  const { mutateAsync: revokeSessions, isPending: isRevoking } = useRevokeUserSessions();
  const sessions = Array.isArray(sessionsResp?.data) ? sessionsResp.data : [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col overflow-hidden"
      >
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-8 pb-6">
            <IdentitySection isNewMode={isNewMode} isDetailMode={isDetailMode} />
            <RoleAssignmentsSection isDetailMode={isDetailMode} roles={roles} branches={branches} />
            <OrgSection
              isDetailMode={isDetailMode}
              homeBranchOptions={homeBranchOptions}
              activeBranchOptions={activeBranchOptions}
              workingScopeOptions={workingScopeOptions}
              isSalesRole={isSalesRole}
              lockedSalesType={lockedSalesType}
              userOptions={userOptions}
            />
            <AccountSection
              onPasswordChange={(pw) => form.setValue("password", pw)}
            />
          </div>
        </ScrollArea>

        <div className="border-border flex flex-row items-center gap-2.5 border-t p-5 pb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={closeUserFormSheet}
            disabled={isPending}
          >
            Close
          </Button>
          <div className="flex-1" />
          <Button
            type="button"
            variant="outline"
            onClick={closeUserFormSheet}
            disabled={isPending}
            className="mr-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isDetailMode || isPending}
            className="font-semibold"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isNewMode ? "Create User" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
