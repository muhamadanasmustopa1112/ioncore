"use client";

import { UseFormReturn } from "react-hook-form";
import { RiAlertLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { type SuspensionFormValues } from "../../../types/suspension-schema";

const NOTIFICATION_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

interface SuspensionRulesSectionProps {
  form: UseFormReturn<SuspensionFormValues>;
  disabled: boolean;
}

export function SuspensionRulesSection({ form, disabled }: SuspensionRulesSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const suspensionAutomatic = watch("suspension_automatic");
  const radiusAction = watch("suspension_ion_radius_action");
  const notificationChannels = watch("suspension_notification_channels");

  const toggleChannel = (channel: string) => {
    const current = notificationChannels ?? [];
    if (current.includes(channel)) {
      setValue("suspension_notification_channels", current.filter((c) => c !== channel));
    } else {
      setValue("suspension_notification_channels", [...current, channel]);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiAlertLine className="size-4 text-red-500" />
        <h3 className="text-sm font-semibold">Suspension Rules</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Automatic Suspension</Label>
          <Switch
            size="sm"
            checked={suspensionAutomatic}
            onCheckedChange={(v) => setValue("suspension_automatic", v)}
            disabled={disabled}
          />
        </div>
        {suspensionAutomatic && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Trigger</Label>
            <Select
              value={watch("suspension_trigger")}
              onValueChange={(v) =>
                setValue("suspension_trigger", v as SuspensionFormValues["suspension_trigger"])
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after_grace_period">After Grace Period</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Requires Manual Approval</Label>
          <Switch
            size="sm"
            checked={watch("suspension_requires_manual_approval")}
            onCheckedChange={(v) => setValue("suspension_requires_manual_approval", v)}
            disabled={disabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Requires Executive Approval</Label>
          <Switch
            size="sm"
            checked={watch("suspension_requires_executive_approval")}
            onCheckedChange={(v) => setValue("suspension_requires_executive_approval", v)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">ION Radius Action</Label>
          <Select
            value={radiusAction}
            onValueChange={(v) =>
              setValue("suspension_ion_radius_action", v as SuspensionFormValues["suspension_ion_radius_action"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_block">Full Block</SelectItem>
              <SelectItem value="throttle">Throttle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {radiusAction === "throttle" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Throttle Speed (Kbps)</Label>
            <Input
              type="number"
              min={64}
              disabled={disabled}
              {...register("suspension_throttle_speed_kbps", { valueAsNumber: true })}
            />
            {errors.suspension_throttle_speed_kbps && (
              <p className="text-xs text-red-500">{errors.suspension_throttle_speed_kbps.message}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Notification Enabled</Label>
          <Switch
            size="sm"
            checked={watch("suspension_notification")}
            onCheckedChange={(v) => setValue("suspension_notification", v)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Notification Channels</Label>
          <div className="flex gap-4">
            {NOTIFICATION_CHANNELS.map((ch) => (
              <label key={ch.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={notificationChannels?.includes(ch.value) ?? false}
                  onCheckedChange={() => toggleChannel(ch.value)}
                  disabled={disabled}
                />
                <span className="text-xs text-muted-foreground">{ch.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
