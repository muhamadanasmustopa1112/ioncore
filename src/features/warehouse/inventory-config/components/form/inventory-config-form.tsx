"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { RiSettings3Line, RiInformationLine } from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useInventoryConfigStore } from "../../store/inventory-config";
import { inventoryConfigSchema, type InventoryConfigFormData } from "../../types";

type InventoryConfigFormProps = {
  mode: "new" | "edit" | "details";
  onSuccess?: () => void;
  warehouseId?: string;
  readOnly?: boolean;
};

export type InventoryConfigFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const InventoryConfigForm = forwardRef<InventoryConfigFormRef, InventoryConfigFormProps>(
  ({ mode, onSuccess, warehouseId, readOnly = false }, ref) => {
    const { t } = useTranslation();
    const { closeFormSheet, selectedConfig } = useInventoryConfigStore();

    const data = selectedConfig;
    const form = useForm<InventoryConfigFormData>({
      resolver: zodResolver(inventoryConfigSchema),
      values: (data && mode !== "new") ? {
        warehouseId: data.warehouseId,
        warehouseName: data.warehouseName,
        valuationMethod: data.valuationMethod,
        notes: data.notes || "",
      } : {
        warehouseId: warehouseId || "",
        warehouseName: "",
        valuationMethod: "FIFO",
        notes: "",
      },
    });

    const isPending = false;

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.handleSubmit(onSubmit)();
      },
      isPending,
    }));

    const onSubmit = (formData: InventoryConfigFormData) => {
      console.log("Saving inventory config:", formData);
      onSuccess?.();
      closeFormSheet();
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-8 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <RiSettings3Line className="size-4 text-blue-500" />
                      <h3 className="text-sm font-semibold">
                        {t("warehouse.valuationSettings", "Valuation Settings")}
                      </h3>
                    </div>

                    {mode !== "new" && data && (
                      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                          {t("warehouse.warehouse", "Warehouse")}
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                          {data.warehouseName}
                        </p>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="valuationMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("warehouse.valuationMethod", "Valuation Method")}
                          </FormLabel>
                          <Select
                            disabled={readOnly || isPending}
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("warehouse.selectMethod", "Select method")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FIFO">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">FIFO</span>
                                  <span className="text-xs text-slate-400">— First In, First Out</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="LIFO">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">LIFO</span>
                                  <span className="text-xs text-slate-400">— Last In, First Out</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                      <RiInformationLine className="size-4 text-slate-500" />
                      <h3 className="text-sm font-semibold">
                        {t("common.additionalInfo", "Additional Info")}
                      </h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common.notes", "Notes")}</FormLabel>
                          <Textarea
                            placeholder={t("warehouse.notesPlaceholder", "Add notes about this configuration...")}
                            className="min-h-[100px] resize-none"
                            {...field}
                            disabled={readOnly || isPending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  }
);

InventoryConfigForm.displayName = "InventoryConfigForm";
