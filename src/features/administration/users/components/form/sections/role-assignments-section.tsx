"use client";

import { useTranslation } from "react-i18next";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { RiShieldCheckLine } from "@remixicon/react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserFormValues } from "../form-schema";

interface RoleAssignmentsSectionProps {
  isDetailMode?: boolean;
  roles: { id: string; name: string }[];
  branches: { id: string; name: string }[];
}

export function RoleAssignmentsSection({
  isDetailMode,
  roles,
  branches,
}: RoleAssignmentsSectionProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<UserFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "roleAssignments" });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiShieldCheckLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("administration.users.roleAssignments")}</h3>
      </div>

      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("administration.users.selectBranchFirst")}
          </p>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Controller
              control={control}
              name={`roleAssignments.${index}.roleId`}
              render={({ field: f }) => (
                <Select onValueChange={f.onChange} value={f.value ?? ""} disabled={isDetailMode}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t("administration.users.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              control={control}
              name={`roleAssignments.${index}.branchId`}
              render={({ field: f }) => (
                <Select onValueChange={f.onChange} value={f.value ?? ""} disabled={isDetailMode}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={t("administration.users.selectBranch")} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {!isDetailMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 shrink-0 text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
        {!isDetailMode && (
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full text-sm"
            onClick={() => append({ roleId: "", branchId: "" })}
          >
            <Plus className="size-4 mr-1" />
            {t("administration.users.addRoleAssignment")}
          </Button>
        )}
      </div>
    </div>
  );
}