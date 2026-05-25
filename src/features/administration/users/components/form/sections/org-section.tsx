"use client";

import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiOrganizationChart } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserFormValues } from "../form-schema";

interface OrgSectionProps {
  isDetailMode?: boolean;
  homeBranchOptions: { value: string; label: string }[];
  activeBranchOptions: { value: string; label: string }[];
  workingScopeOptions: { value: string; label: string }[];
  isSalesRole: boolean;
  lockedSalesType: string | null;
  userOptions: { id: string; name: string; level: number }[];
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
  const { t } = useTranslation();
  const { control } = useFormContext<UserFormValues>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiOrganizationChart className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("administration.users.organization")}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="functionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.functionName")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("administration.users.functionName")} {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.department")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("administration.users.department")} {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.position")}
              </FormLabel>
              <FormControl>
                <Input placeholder={t("administration.users.position")} {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="workingScope"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.workingScope")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDetailMode}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("administration.users.selectWorkingScope")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {workingScopeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">{t("administration.users.workingScopeDescription")}</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSalesRole && (
          <FormField
            control={control}
            name="salesType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-muted-foreground">
                  {t("administration.users.salesType")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={lockedSalesType ?? field.value ?? ""}
                  disabled={isDetailMode || !!lockedSalesType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("administration.users.selectSalesType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="broadband">{t("administration.users.broadband")}</SelectItem>
                    <SelectItem value="enterprise">{t("administration.users.enterprise")}</SelectItem>
                    <SelectItem value="both">{t("administration.users.bothSales")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="homeBranchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.homeBranch")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDetailMode}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("administration.users.selectBranch")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {homeBranchOptions.map((b) => (
                    <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="reportsToUserId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.selectUser")}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isDetailMode}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("administration.users.selectUser")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userOptions.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {"—".repeat(u.level)}{u.level > 0 ? " " : ""}{u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}