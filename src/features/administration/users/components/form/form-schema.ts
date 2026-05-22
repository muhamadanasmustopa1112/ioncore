import { z } from "zod";

import { passwordZodSchema } from "@/lib/password";

export const roleAssignmentSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
  branchId: z.string().min(1, "Branch is required"),
});

export const userFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  employeeId: z.string().min(1, "Employee ID is required"),
  functionName: z.string().optional(),
  department: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  workingScope: z.enum(["regional", "area", "sub_area", ""]).optional(),
  salesType: z.enum(["broadband", "enterprise", "both", ""]).optional(),
  technicianId: z.string().optional(),
  homeBranchId: z.string().min(1, "Home branch is required"),
  activeBranchId: z.string().min(1, "Active branch is required"),
  reportsToUserId: z.string().min(1, "Reports to is required"),
  roleAssignments: z.array(roleAssignmentSchema).min(1, "At least one role assignment is required"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const createUserFormSchema = (isNewMode: boolean) =>
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
  });
