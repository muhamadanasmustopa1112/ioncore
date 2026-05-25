"use client";

import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiIdCardLine } from "@remixicon/react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UserFormValues } from "../form-schema";

interface IdentitySectionProps {
  isNewMode?: boolean;
  isDetailMode?: boolean;
}

export function IdentitySection({ isNewMode, isDetailMode }: IdentitySectionProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<UserFormValues>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiIdCardLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("administration.users.identity")}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.fullName")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("administration.users.fullName")}
                  {...field}
                  disabled={isDetailMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.email")} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("administration.users.email")}
                  {...field}
                  disabled={isDetailMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.phone")}
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+62..."
                  {...field}
                  disabled={isDetailMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">
                {t("administration.users.employeeId")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="EMP-0001"
                  {...field}
                  disabled={isDetailMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}