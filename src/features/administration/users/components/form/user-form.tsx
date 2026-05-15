"use client";

import { useEffect } from "react";
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
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
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
import { useCreateUser, useUpdateUser, useAssignUserRoles, useAssignUserBranches, useUserSessions, useRevokeUserSessions, useUsers } from "@/features/user-service/api/users";
import { getPasswordRules, passwordZodSchema } from "@/lib/password";
import { Monitor, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roleAssignmentSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  branchId: z.string().min(1, "Branch is required"),
});

const userFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  employeeId: z.string().min(1, "Employee ID is required"),
  functionName: z.string().optional(),
  department: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  workingScope: z.string().optional(),
  salesType: z.enum(["broadband", "enterprise", "both", ""]).optional(),
  technicianId: z.string().optional(),
  homeBranchId: z.string().min(1, "Home branch is required"),
  activeBranchId: z.string().min(1, "Active branch is required"),
  reportsToUserId: z.string().optional(),
  roleAssignments: z.array(roleAssignmentSchema).min(1, "At least one role assignment is required"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

function PwRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
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
  const { form: formMode, selectedUser, closeUserFormSheet } = useUserStore();
  const isNewMode = formMode === "new";
  const isDetailMode = formMode === "details";

  const { data: rolesResp } = useRoles({ per_page: 100 });
  const { data: branchList } = useBranchList({ per_page: 100 });
  const { data: usersResp } = useUsers({ per_page: 100 });
  const roles = rolesResp?.data || [];
  const branches: BranchData[] = branchList ?? [];
  const allUsers = usersResp?.data || [];

  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      userFormSchema.superRefine((data, ctx) => {
        if (isNewMode) {
          if (!data.password) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Password is required",
              path: ["password"],
            });
          } else {
            const result = passwordZodSchema.safeParse(data.password);
            if (!result.success) {
              result.error.issues.forEach((issue) => {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: issue.message,
                  path: ["password"],
                });
              });
            }
          }
        }
      })
    ),
    defaultValues: {
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roleAssignments",
  });

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        phone: selectedUser.phone ?? "",
        employeeId: selectedUser.employeeId ?? "",
        functionName: selectedUser.functionName ?? "",
        department: selectedUser.department ?? "",
        position: selectedUser.position ?? "",
        workingScope: selectedUser.workingScope ?? "",
        salesType: selectedUser.salesType ?? "",
        technicianId: selectedUser.technicianId ?? "",
        homeBranchId: selectedUser.homeBranchId ?? "",
        activeBranchId: selectedUser.activeBranchId ?? "",
        reportsToUserId: selectedUser.reportsToUserId ?? "",
        password: "",
        roleAssignments:
          selectedUser.roleAssignments.length > 0
            ? selectedUser.roleAssignments.map((r) => ({
              roleId: r.roleId,
              branchId: r.branchId,
            }))
            : [{ roleId: "", branchId: "" }],
      });
    } else {
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

  const password = form.watch("password");

  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: assignRoles, isPending: isAssigning } = useAssignUserRoles();
  const { mutateAsync: assignBranches, isPending: isAssigningBranches } = useAssignUserBranches();
  const { data: sessionsResp } = useUserSessions(selectedUser?.id ?? "", { active_only: true });
  const { mutateAsync: revokeSessions, isPending: isRevoking } = useRevokeUserSessions();
  const sessions = Array.isArray(sessionsResp?.data) ? sessionsResp.data : [];
  const isPending = isCreating || isUpdating || isAssigning || isAssigningBranches;

  const pwRules = getPasswordRules(password || "");

  const onSubmit = async (values: UserFormValues) => {
    if (isDetailMode) {
      closeUserFormSheet();
      return;
    }

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
          },
        });

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

        // Synchronize roles and branches
        await Promise.all([
          assignRoles({ id: selectedUser.id, payload: { role_ids } }),
          assignBranches({ id: selectedUser.id, payload: { branch_ids } }),
        ]);

        toast.success("User updated");
        closeUserFormSheet();
      } catch (error: any) {
        const errorData = error?.response?.data;
        const errorMessage = errorData?.error || errorData?.message || "";
        if (errorMessage.toLowerCase().includes("email already registered")) {
          form.setError("email", {
            type: "server",
            message: "This email is already registered",
          });
          return;
        }

        if (errorMessage.toLowerCase().includes("employee") &&
          errorMessage.toLowerCase().includes("registered")) {
          form.setError("employeeId", {
            type: "server",
            message: "This Employee ID is already registered",
          });
          return;
        }

        if (errorData?.errors) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            let formField: any = field;
            if (field === "name") formField = "fullName";
            if (field === "job_title") formField = "position";
            if (field === "unit_kerja") formField = "department";
            if (field === "employee_id") formField = "employeeId";
            if (field === "function_name") formField = "functionName";
            if (field === "working_scope") formField = "workingScope";
            if (field === "sales_type") formField = "salesType";
            if (field === "technician_id") formField = "technicianId";
            if (field === "reports_to_user_id") formField = "reportsToUserId";
            if (field === "home_branch_id") formField = "homeBranchId";
            if (field === "active_branch_id") formField = "activeBranchId";

            form.setError(formField, {
              type: "server",
              message: (messages as string[])[0],
            });
          });
        } else {
          toast.error(errorData?.error || errorData?.message || "Failed to update user");
        }
      }
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
      const errorData = error?.response?.data;
      const errorMessage = errorData?.error || errorData?.message || "";
      console.log("Submit Error (Create):", errorData); // DEBUG

      if (errorMessage.toLowerCase().includes("email already registered")) {
        form.setError("email", {
          type: "server",
          message: "This email is already registered",
        });
        return;
      }

      if (errorMessage.toLowerCase().includes("employee") &&
        errorMessage.toLowerCase().includes("registered")) {
        form.setError("employeeId", {
          type: "server",
          message: "This Employee ID is already registered",
        });
        return;
      }

      if (errorData?.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          let formField: any = field;
          if (field === "name") formField = "fullName";
          if (field === "job_title") formField = "position";
          if (field === "unit_kerja") formField = "department";
          if (field === "employee_id") formField = "employeeId";
          if (field === "function_name") formField = "functionName";
          if (field === "working_scope") formField = "workingScope";
          if (field === "sales_type") formField = "salesType";
          if (field === "technician_id") formField = "technicianId";
          if (field === "reports_to_user_id") formField = "reportsToUserId";
          if (field === "home_branch_id") formField = "homeBranchId";
          if (field === "active_branch_id") formField = "activeBranchId";

          form.setError(formField, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      } else {
        toast.error(errorData?.error || errorData?.message || "Failed to create user");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col overflow-hidden"
      >
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-8 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eko Wahyudi"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="eko@ion.id"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                {isNewMode && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2 md:col-span-2">
                        <FormLabel className="text-xs font-medium text-muted-foreground">
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Temporary password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                        <ul className="mt-1.5 space-y-1 text-[11px]">
                          <PwRule ok={pwRules.length} label="Min 8 characters" />
                          <PwRule ok={pwRules.uppercase} label="Min 1 uppercase letter" />
                          <PwRule ok={pwRules.lowercase} label="Min 1 lowercase letter" />
                          <PwRule ok={pwRules.special} label="Min 1 special character" />
                          <PwRule ok={pwRules.noSpace} label="No spaces" />
                        </ul>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+62812 ..."
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Employee ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="EMP-001"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="functionName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Function Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Operation"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiOrganizationChart className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">Organization</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Department</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sales"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sales Representative"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workingScope"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Working Scope</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. National"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salesType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Sales Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="broadband">Broadband</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="both">Both (Broadband & Enterprise)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[10px] leading-tight">
                        Changes will take effect on the next login (updates pipeline visibility).
                      </FormDescription>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="technicianId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">Technician ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. TECH-001"
                          {...field}
                          disabled={isDetailMode}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="homeBranchId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Home Branch
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select home branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activeBranchId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Active Branch
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select active branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reportsToUserId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Reports To (Supervisor)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isDetailMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {allUsers.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} ({u.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
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
                                onValueChange={field.onChange}
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
                                      {b.name}
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
