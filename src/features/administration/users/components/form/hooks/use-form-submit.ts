"use client";

import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import {
  useCreateUser,
  useUpdateUser,
  useAssignUserRoles,
  useAssignUserBranches,
  useRevokeUserSessions,
} from "@/features/user-service/api/users";
import type { UserFormValues } from "../form-schema";
import type { UserData } from "../../../types";

interface UseFormSubmitParams {
  form: UseFormReturn<UserFormValues>;
  selectedUser: UserData | null;
  isNewMode: boolean;
  isDetailMode: boolean;
  closeUserFormSheet: () => void;
}

const FIELD_MAP: Record<string, string> = {
  name: "fullName",
  job_title: "position",
  unit_kerja: "department",
  employee_id: "employeeId",
  function_name: "functionName",
  working_scope: "workingScope",
  sales_type: "salesType",
  technician_id: "technicianId",
  reports_to_user_id: "reportsToUserId",
  home_branch_id: "homeBranchId",
  active_branch_id: "activeBranchId",
};

function mapServerErrors(form: UseFormReturn<UserFormValues>, errors: Record<string, string[]>) {
  Object.entries(errors).forEach(([field, messages]) => {
    const formField = FIELD_MAP[field] || field;
    form.setError(formField as any, {
      type: "server",
      message: (messages as string[])[0],
    });
  });
}

function handleSubmitError(
  form: UseFormReturn<UserFormValues>,
  error: any,
  fallbackMsg: string,
) {
  const errorData = error?.response?.data;
  const errorMessage = errorData?.error || errorData?.message || "";

  if (errorMessage.toLowerCase().includes("email already registered")) {
    form.setError("email", { type: "server", message: "This email is already registered" });
    return;
  }

  if (
    errorMessage.toLowerCase().includes("employee") &&
    errorMessage.toLowerCase().includes("registered")
  ) {
    form.setError("employeeId", { type: "server", message: "This Employee ID is already registered" });
    return;
  }

  if (errorData?.errors) {
    mapServerErrors(form, errorData.errors);
  } else {
    toast.error(errorData?.error || errorData?.message || fallbackMsg);
  }
}

export function useFormSubmit({
  form,
  selectedUser,
  isNewMode,
  isDetailMode,
  closeUserFormSheet,
}: UseFormSubmitParams) {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignUserRoles();
  const { mutateAsync: assignBranches, isPending: isAssigningBranches } = useAssignUserBranches();
  const { mutateAsync: revokeSessions } = useRevokeUserSessions();

  const isPending = isCreating || isUpdating || isAssigning || isAssigningBranches;

  const onSubmit = async (values: UserFormValues) => {
    if (isDetailMode) {
      closeUserFormSheet();
      return;
    }

    const role_ids = Array.from(
      new Set(values.roleAssignments.map((r) => r.roleId).filter(Boolean)),
    );
    const branch_ids = Array.from(
      new Set(
        [
          ...values.roleAssignments.map((r) => r.branchId),
          values.homeBranchId,
        ].filter(Boolean) as string[],
      ),
    );

    if (!isNewMode && selectedUser) {
      try {
        await updateUser({
          id: selectedUser.id,
          payload: {
            name: values.fullName.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() || undefined,
            job_title: values.position?.trim() || undefined,
            unit_kerja: values.department?.trim() || undefined,
            home_branch_id: values.homeBranchId || undefined,
            employee_id: values.employeeId || undefined,
            function_name: values.functionName || undefined,
            working_scope: values.workingScope || undefined,
            sales_type: values.salesType || undefined,
            technician_id: values.technicianId || undefined,
            active_branch_id: values.activeBranchId || undefined,
            reports_to_user_id: values.reportsToUserId || undefined,
            role_ids: role_ids.length ? role_ids : undefined,
            branch_ids: branch_ids.length ? branch_ids : undefined,
          },
        });

        const hasScopeChanged = values.workingScope !== selectedUser.workingScope;
        const oldRoleIds = selectedUser.roleAssignments.map((r) => r.roleId).sort().join(",");
        const hasRolesChanged = oldRoleIds !== role_ids.sort().join(",");
        const oldBranchIds = Array.from(new Set([
          ...selectedUser.roleAssignments.map((r) => r.branchId),
          selectedUser.homeBranchId,
        ])).filter(Boolean).sort().join(",");
        const hasBranchesChanged = oldBranchIds !== branch_ids.sort().join(",");

        let description: string | undefined;
        if (hasScopeChanged || hasRolesChanged || hasBranchesChanged) {
          try {
            await revokeSessions(selectedUser.id);
            description = "Active sessions have been revoked to ensure security.";
          } catch (e) {
            console.error("Failed to revoke sessions:", e);
          }
        }

        toast.success("User updated", { description });
        closeUserFormSheet();
      } catch (error: any) {
        handleSubmitError(form, error, "Failed to update user");
      }
      return;
    }

    try {
      await createUser({
        name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password || "",
        phone: values.phone?.trim() || undefined,
        job_title: values.position?.trim() || undefined,
        unit_kerja: values.department?.trim() || undefined,
        home_branch_id: values.homeBranchId || undefined,
        role_ids: role_ids.length ? role_ids : undefined,
        branch_ids: branch_ids.length ? branch_ids : undefined,
        ...({
          employee_id: values.employeeId || undefined,
          function_name: values.functionName || undefined,
          working_scope: values.workingScope || undefined,
          sales_type: values.salesType || undefined,
          technician_id: values.technicianId || undefined,
          active_branch_id: values.activeBranchId || undefined,
          reports_to_user_id: values.reportsToUserId || undefined,
        } as any),
      });
      toast.success("User created");
      closeUserFormSheet();
    } catch (error: any) {
      handleSubmitError(form, error, "Failed to create user");
    }
  };

  return { onSubmit, isPending };
}
