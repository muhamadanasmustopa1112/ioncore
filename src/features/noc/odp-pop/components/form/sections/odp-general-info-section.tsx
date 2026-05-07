"use client";

import { useFormContext } from "react-hook-form";
import {
  RiSignalTowerLine,
  RiInformationLine,
  RiHashtag,
  RiStackLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OdpFormValues } from "../../../types/odp";

type OdpGeneralInfoSectionProps = {
  readOnly: boolean;
  isPending: boolean;
};

export function OdpGeneralInfoSection({
  readOnly,
  isPending,
}: OdpGeneralInfoSectionProps) {
  const { control } = useFormContext<OdpFormValues>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiSignalTowerLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">General Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiHashtag className="size-3" />
                Code
              </FormLabel>
              <FormControl>
                <Input placeholder="ODP-LBN-001" {...field} disabled={readOnly || isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground">ODP Name</FormLabel>
              <FormControl>
                <Input placeholder="ODP LABUAN MAIN" {...field} disabled={readOnly || isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="total_port"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiStackLine className="size-3" />
                Total Ports
              </FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
                disabled={readOnly || isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ports" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <RiInformationLine className="size-3" />
                Status
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={readOnly || isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UP">Up</SelectItem>
                  <SelectItem value="DOWN">Down</SelectItem>
                  <SelectItem value="DEGRADED">Degraded</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
