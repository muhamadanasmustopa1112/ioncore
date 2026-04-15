"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DEFAULT_OLT_VALUES, OltFormValues, oltSchema } from "../../types/olt";
import { zodResolver } from "@hookform/resolvers/zod";

const WAREHOUSE_OLTS = [
  { value: "OLT-JKT-RAISECOM-01", label: "OLT-JKT-RAISECOM-01", model: "Raisecom ISCOM5508" },
  { value: "OLT-JKT-ZTE-02", label: "OLT-JKT-ZTE-02", model: "ZTE ZXA10 C320" },
  { value: "OLT-BDG-HUAWEI-01", label: "OLT-BDG-HUAWEI-01", model: "Huawei EA5800-X17" },
  { value: "OLT-MDN-ZTE-01", label: "OLT-MDN-ZTE-01", model: "ZTE ZXA10 C300" },
  { value: "OLT-SUB-RAISECOM-03", label: "OLT-SUB-RAISECOM-03", model: "Raisecom ISCOM5508" },
];

export function AddOltForm() {
  const form = useForm<OltFormValues>({
    resolver: zodResolver(oltSchema),
    defaultValues: DEFAULT_OLT_VALUES as OltFormValues,
  });
  const expansionValue = form.watch("expansion");

  return (
    <div className="space-y-4">
      {/* OLT Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-muted-foreground">
              OLT Name (Warehouse)
            </FormLabel>
            <FormControl>
              <SearchableSelect
                options={WAREHOUSE_OLTS}
                value={field.value}
                onSelect={(value, option) => {
                  form.setValue("name", value);
                  form.setValue("model", option.model);
                }}
                placeholder="Select OLT from warehouse..."
                searchPlaceholder="Search OLT name..."
                emptyText="No OLT found in warehouse."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Model & Status */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Model</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Raisecom ISCOM5508">Raisecom ISCOM5508</SelectItem>
                  <SelectItem value="ZTE ZXA10 C320">ZTE ZXA10 C320</SelectItem>
                  <SelectItem value="ZTE ZXA10 C300">ZTE ZXA10 C300</SelectItem>
                  <SelectItem value="Huawei EA5800-X17">Huawei EA5800-X17</SelectItem>
                  <SelectItem value="Huawei MA5608T">Huawei MA5608T</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* IP Address & Total Ports */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">IP Address</FormLabel>
              <FormControl>
                <Input placeholder="10.1.5.44" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalPorts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Total Ports</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="16"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Expansion */}
      <FormField
        control={form.control}
        name="expansion"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-xs text-muted-foreground">Expansion</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === "no") {
                    form.setValue("expansionPorts", undefined);
                  }
                }}
                value={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="expansion-yes" />
                  <Label htmlFor="expansion-yes" className="font-medium cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="expansion-no" />
                  <Label htmlFor="expansion-no" className="font-medium cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Expansion Ports — only shown when expansion is "yes" */}
      {expansionValue === "yes" && (
        <FormField
          control={form.control}
          name="expansionPorts"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
              <FormLabel className="text-xs text-muted-foreground">Expansion Ports</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="8"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
