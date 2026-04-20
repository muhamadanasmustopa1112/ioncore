"use client";

import { useFormContext } from "react-hook-form";
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
import { OdpFormValues } from "../../types/odp";

export function AddOdpForm() {
  const form = useFormContext<OdpFormValues>();

  return (
    <div className="space-y-4">
      {/* ODP Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-muted-foreground">ODP Name</FormLabel>
            <FormControl>
              <Input placeholder="ODP-LBN-42260-30-001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* PON Port & Status */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ponPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">PON Port</FormLabel>
              <FormControl>
                <Input placeholder="PON 1/1" {...field} />
              </FormControl>
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

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Latitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="-6.38833"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Longitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="105.83925"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Ports Info */}
      <div className="grid grid-cols-2 gap-4">
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portsUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-muted-foreground">Ports Used</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
