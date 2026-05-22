"use client";

import { RiShieldLine, RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BranchData } from "@/features/administration/branch/types/branch";
import type { Role } from "@/features/user-service/types";
import type { UserFormValues } from "../form-schema";

interface RoleAssignmentsSectionProps {
  isDetailMode: boolean;
  roles: Role[];
  branches: BranchData[];
}

export function RoleAssignmentsSection({ isDetailMode, roles, branches }: RoleAssignmentsSectionProps) {
  const form = useFormContext<UserFormValues>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roleAssignments",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/50">
        <RiShieldLine className="size-4 text-purple-500" />
        <h3 className="text-sm font-semibold">Role Assignments</h3>
      </div>
      <div className="space-y-3">
        {fields.map((row, index) => {
          const roleId = form.watch(`roleAssignments.${index}.roleId`);
          const roleName = roles.find((r) => r.id === roleId)?.name ?? "";
          const isTechRole = /technician|technical/i.test(roleName);
          const filteredBranches = isTechRole
            ? branches.filter((b) => b.branchType === "noc")
            : branches;
          return (
            <div key={row.id} className="flex items-start gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`roleAssignments.${index}.roleId`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          const role = roles.find((r) => r.id === val);
                          const name = role?.name.toLowerCase() || "";
                          if (name.includes("sales")) {
                            if (name.includes("both")) form.setValue("salesType", "both");
                            else if (name.includes("enterprise")) form.setValue("salesType", "enterprise");
                            else if (name.includes("broadband")) form.setValue("salesType", "broadband");
                          }
                        }}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`roleAssignments.${index}.branchId`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredBranches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              <div className="flex flex-col">
                                <span>{b.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">
                                  {b.level?.replace("_", " ")} • {b.branchType}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
              {!isDetailMode && (
                <Button
                  type="button"
                  mode="icon"
                  variant="ghost"
                  className="size-8 shrink-0 text-muted-foreground hover:text-destructive mt-1"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <RiDeleteBinLine />
                </Button>
              )}
            </div>
          );
        })}
        {!isDetailMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ roleId: "", branchId: "" })}
            className="mt-1"
          >
            <RiAddLine />
            Add Role Assignment
          </Button>
        )}
        {form.formState.errors.roleAssignments?.message && (
          <p className="text-destructive text-[11px]">
            {form.formState.errors.roleAssignments.message}
          </p>
        )}
      </div>
    </div>
  );
}
