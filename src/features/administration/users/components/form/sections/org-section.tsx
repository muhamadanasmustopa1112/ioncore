"use client";

import { RiOrganizationChart } from "@remixicon/react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BranchData } from "@/features/administration/branch/types/branch";
import type { UserFormValues } from "../form-schema";

interface UserOption {
  id: string;
  name: string;
  email: string;
  level: number;
}

interface OrgSectionProps {
  isDetailMode: boolean;
  homeBranchOptions: BranchData[];
  activeBranchOptions: BranchData[];
  workingScopeOptions: { value: string; label: string }[];
  isSalesRole: boolean;
  lockedSalesType: "both" | "enterprise" | "broadband" | null;
  userOptions: UserOption[];
}

export function OrgSection({
  isDetailMode,
  homeBranchOptions,
  activeBranchOptions,
  workingScopeOptions,
  isSalesRole,
  lockedSalesType,
  userOptions,
}: OrgSectionProps) {
  const form = useFormContext<UserFormValues>();

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-1 border-b border-border/50">
        <RiOrganizationChart className="size-4 text-emerald-500" />
        <h3 className="text-sm font-semibold">Organization</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-medium text-muted-foreground">Department</FormLabel>
              <FormControl>
                <Input placeholder="Sales" {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-medium text-muted-foreground">Position</FormLabel>
              <FormControl>
                <Input placeholder="Sales Representative" {...field} disabled={isDetailMode} />
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
              <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select working scope" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workingScopeOptions.length === 0 ? (
                    <SelectItem value="no-scope" disabled>
                      Select branch in Role Assignment first
                    </SelectItem>
                  ) : (
                    workingScopeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="text-[10px] leading-tight">
                Determines the breadth of record access.
              </FormDescription>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        {isSalesRole && (
          <FormField
            control={form.control}
            name="salesType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-medium text-muted-foreground">Sales Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isDetailMode || !!lockedSalesType}
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
        )}
        <FormField
          control={form.control}
          name="homeBranchId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-medium text-muted-foreground">Home Branch</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {homeBranchOptions.length === 0 ? (
                    <SelectItem value="no-branch" disabled>
                      Select branch in Role Assignment first
                    </SelectItem>
                  ) : (
                    homeBranchOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{b.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {b.level?.replace("_", " ")} • {b.branchType}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
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
              <FormLabel className="text-xs font-medium text-muted-foreground">Active Branch</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select active branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeBranchOptions.length === 0 ? (
                    <SelectItem value="no-branch" disabled>
                      Select branch in Role Assignment first
                    </SelectItem>
                  ) : (
                    activeBranchOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{b.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {b.level?.replace("_", " ")} • {b.branchType}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
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
              <Select onValueChange={field.onChange} value={field.value} disabled={isDetailMode}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {userOptions.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      <div className="flex items-center gap-1">
                        {u.level > 0 && (
                          <span className="text-muted-foreground/50 font-mono">
                            {"\u00A0".repeat(u.level * 2)}└─
                          </span>
                        )}
                        <span className={u.level === 0 ? "font-semibold" : ""}>{u.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({u.email})</span>
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
    </div>
  );
}
