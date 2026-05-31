"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  invoiceSchema,
  type InvoiceFormData,
} from "../../api/post-invoice";
import { useCreateInvoice } from "../../api/post-invoice";
import { useUpdateInvoice } from "../../api/put-invoice";
import type { InvoiceItem } from "../../types";

interface InvoiceFormProps {
  onSuccess?: () => void;
  invoice?: InvoiceItem | null;
  readOnly?: boolean;
  mode: "new" | "edit" | "details" | null;
}

export interface InvoiceFormRef {
  submit: () => void;
  isPending: boolean;
}

export const InvoiceForm = forwardRef<InvoiceFormRef, InvoiceFormProps>(
  ({ onSuccess, invoice, readOnly, mode }, ref) => {
    const { t } = useTranslation();

    const form = useForm<InvoiceFormData>({
      resolver: zodResolver(invoiceSchema),
      values:
        invoice && mode !== "new"
          ? {
              customerId: invoice.customerId,
              customerName: invoice.customerName,
              customerType: invoice.customerType,
              type: invoice.type,
              dueDate: invoice.dueDate,
              branch: invoice.branch,
              notes: invoice.notes || "",
              billingSchemaVersion: invoice.billingSchemaVersion,
              lineItems: invoice.lineItems.map((li) => ({
                description: li.description,
                quantity: li.quantity,
                unitPrice: li.unitPrice,
              })),
            }
          : {
              customerId: "",
              customerName: "",
              customerType: "broadband",
              type: "recurring",
              dueDate: "",
              branch: "",
              notes: "",
              billingSchemaVersion: "v1.0",
              lineItems: [{ description: "", quantity: 1, unitPrice: 0 }],
            },
    });

    const { mutate: createInvoice, isPending: isCreating } =
      useCreateInvoice({
        mutationConfig: { onSuccess },
      });

    const { mutate: updateInvoice, isPending: isUpdating } =
      useUpdateInvoice({
        mutationConfig: { onSuccess },
      });

    const isPending = isCreating || isUpdating;

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isPending,
    }));

    function onSubmit(data: InvoiceFormData) {
      if (mode === "edit" && invoice) {
        updateInvoice({ id: invoice.id, data });
      } else {
        createInvoice(data);
      }
    }

    return (
      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("billing.invoice.billingInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("billing.invoice.customer")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={readOnly}
                        placeholder="Customer name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={readOnly}
                        placeholder="CUST-001"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("billing.invoice.customerType")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="broadband">
                          {t("billing.report.broadband")}
                        </SelectItem>
                        <SelectItem value="business">
                          {t("billing.report.business")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("billing.invoice.type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="otc">
                          {t("billing.common.otc")}
                        </SelectItem>
                        <SelectItem value="recurring">
                          {t("billing.common.recurring")}
                        </SelectItem>
                        <SelectItem value="addon">
                          {t("billing.common.addon")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("billing.invoice.dueDate")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("billing.invoice.branch")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={readOnly}
                        placeholder="Branch name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("billing.invoice.lineItems")}
            </h3>
            {form.watch("lineItems").map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        {t("billing.invoice.description")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("billing.invoice.quantity")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          disabled={readOnly}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>
                          {t("billing.invoice.unitPrice")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={readOnly}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!readOnly && form.watch("lineItems").length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        const items = form.getValues("lineItems");
                        form.setValue(
                          "lineItems",
                          items.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const items = form.getValues("lineItems");
                  form.setValue("lineItems", [
                    ...items,
                    { description: "", quantity: 1, unitPrice: 0 },
                  ]);
                }}
              >
                <Plus className="size-4 mr-2" />
                {t("billing.invoice.addLineItem")}
              </Button>
            )}
          </div>

          <Separator />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("billing.invoice.notes")}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={readOnly} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);

InvoiceForm.displayName = "InvoiceForm";
