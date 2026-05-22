"use client";

import { useState } from "react";
import { RiInformationLine } from "@remixicon/react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getPasswordRules } from "@/lib/password";
import type { UserFormValues } from "../form-schema";

function PwRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      }`}
    >
      {ok ? <Check className="size-3" /> : <X className="size-3" />}
      <span>{label}</span>
    </li>
  );
}

interface IdentitySectionProps {
  isNewMode: boolean;
  isDetailMode: boolean;
}

export function IdentitySection({ isNewMode, isDetailMode }: IdentitySectionProps) {
  const form = useFormContext<UserFormValues>();
  const [pwVisible, setPwVisible] = useState(false);
  const password = form.watch("password");
  const pwRules = getPasswordRules(password || "");

  return (
    <div className="space-y-4 pt-2">
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
                <Input placeholder="Eko Wahyudi" {...field} disabled={isDetailMode} />
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
                <Input type="email" placeholder="eko@ion.id" {...field} disabled={isDetailMode} />
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
                  <div className="relative">
                    <Input
                      type={pwVisible ? "text" : "password"}
                      placeholder="Temporary password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setPwVisible((v) => !v)}
                      className="absolute end-0 top-1/2 me-1.5 h-7 w-7 -translate-y-1/2 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground"
                      aria-label={pwVisible ? "Hide password" : "Show password"}
                    >
                      {pwVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
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
                <Input placeholder="+62812 ..." {...field} disabled={isDetailMode} />
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
                <Input placeholder="EMP-001" {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="functionName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-xs font-medium text-muted-foreground">Function Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Operation" {...field} disabled={isDetailMode} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
