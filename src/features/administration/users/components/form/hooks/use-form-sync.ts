"use client";

import { useEffect, useMemo } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import type { BranchData } from "@/features/administration/branch/types/branch";
import type { Role } from "@/features/user-service/types";
import type { UserFormValues } from "../form-schema";

interface UseFormSyncParams {
  form: UseFormReturn<UserFormValues>;
  branches: BranchData[];
  roles: Role[];
  isDetailMode: boolean;
}

export function useFormSync({ form, branches, roles, isDetailMode }: UseFormSyncParams) {
  const roleAssignments = useWatch({
    control: form.control,
    name: "roleAssignments",
  });

  const assignedBranches = useMemo(() => {
    const selectedBranchIds = (roleAssignments || [])
      .map((ra) => ra.branchId)
      .filter(Boolean);
    const uniqueIds = Array.from(new Set(selectedBranchIds));
    return uniqueIds
      .map((id) => branches.find((b) => b.id === id))
      .filter(Boolean) as BranchData[];
  }, [roleAssignments, branches]);

  const homeBranchId = form.watch("homeBranchId");
  const activeBranchId = form.watch("activeBranchId");

  useEffect(() => {
    if (isDetailMode) return;

    const assignedBranchIds = assignedBranches.map((b) => b.id);

    if (assignedBranchIds.length === 0) {
      if (homeBranchId) {
        form.setValue("homeBranchId", "", { shouldDirty: true, shouldValidate: true });
      }
      if (activeBranchId) {
        form.setValue("activeBranchId", "", { shouldDirty: true, shouldValidate: true });
      }
    } else {
      const targetBranchId = assignedBranchIds[0];
      if (homeBranchId !== targetBranchId) {
        form.setValue("homeBranchId", targetBranchId, { shouldDirty: true, shouldValidate: true });
      }
      if (activeBranchId !== targetBranchId) {
        form.setValue("activeBranchId", targetBranchId, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [assignedBranches, homeBranchId, activeBranchId, form, isDetailMode]);

  const homeBranchOptions = isDetailMode ? branches : assignedBranches;
  const activeBranchOptions = isDetailMode ? branches : assignedBranches;

  const workingScope = form.watch("workingScope");

  const assignedLevels = useMemo(() => {
    const levels = assignedBranches.map((b) => b.level).filter(Boolean);
    return Array.from(new Set(levels));
  }, [assignedBranches]);

  useEffect(() => {
    if (isDetailMode) return;

    if (assignedLevels.length === 0) {
      if (workingScope) {
        form.setValue("workingScope", "", { shouldDirty: true, shouldValidate: true });
      }
    } else {
      const targetLevel = assignedLevels[0];
      if (workingScope !== targetLevel) {
        form.setValue("workingScope", targetLevel, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [assignedLevels, workingScope, form, isDetailMode]);

  const workingScopeOptions = useMemo(() => {
    const allOptions = [
      { value: "regional", label: "Regional" },
      { value: "area", label: "Area" },
      { value: "sub_area", label: "Sub Area" },
    ];
    if (isDetailMode) return allOptions;
    return allOptions.filter((opt) => assignedLevels.includes(opt.value as any));
  }, [assignedLevels, isDetailMode]);

  const { isSalesRole, lockedSalesType } = useMemo(() => {
    const assignedRoleNames = (roleAssignments || []).map((ra) => {
      const role = roles.find((r) => r.id === ra.roleId);
      return role?.name.toLowerCase() || "";
    });

    const hasSales = assignedRoleNames.some((n) => n.includes("sales"));
    const isBoth = assignedRoleNames.some((n) => n.includes("both") && n.includes("sales"));
    const isEnt = assignedRoleNames.some((n) => n.includes("enterprise") && n.includes("sales"));
    const isBb = assignedRoleNames.some((n) => n.includes("broadband") && n.includes("sales"));

    let locked: "both" | "enterprise" | "broadband" | null = null;
    if (isBoth) locked = "both";
    else if (isEnt) locked = "enterprise";
    else if (isBb) locked = "broadband";

    return { isSalesRole: hasSales, lockedSalesType: locked };
  }, [roleAssignments, roles]);

  useEffect(() => {
    if (lockedSalesType) {
      form.setValue("salesType", lockedSalesType, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [lockedSalesType, form]);

  return {
    homeBranchOptions,
    activeBranchOptions,
    workingScopeOptions,
    isSalesRole,
    lockedSalesType,
  };
}
