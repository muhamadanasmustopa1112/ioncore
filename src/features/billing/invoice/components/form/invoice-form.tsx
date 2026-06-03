"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SchemaVersionSelector, useSchemaRules } from "@/components/shared/schema-version-selector";
import { CustomerSelector } from "@/components/shared/customer-selector";
import {
  invoiceSchema,
  type InvoiceFormData,
} from "../../api/post-invoice";
import { useCreateInvoice } from "../../api/post-invoice";
import { useUpdateInvoice } from "../../api/put-invoice";
import type { InvoiceItem, AppliedBillingSchemaRules } from "../../types";
import type { CustomerDto } from "@/features/customers/types/customers-api";

const CUSTOMER_TYPE_MAP: Record<string, "broadband" | "business" | "enterprise" | "corporate"> = {
  residential: "broadband",
  business: "business",
  enterprise: "enterprise",
};

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
    const [selectedSchemaVersionId, setSelectedSchemaVersionId] = useState(
      invoice?.billingSchemaVersionId || ""
    );

    const { rules: appliedRulesRaw } = useSchemaRules(
      selectedSchemaVersionId || null
    );

    const appliedRules = appliedRulesRaw as AppliedBillingSchemaRules | null;

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
              billingSchemaVersionId: invoice.billingSchemaVersionId,
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
              billingSchemaVersionId: "",
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

    const customerType = form.watch("customerType");

    const handleCustomerSelect = (customer: CustomerDto | null) => {
      if (!customer) {
        form.setValue("customerId", "");
        form.setValue("customerName", "");
        form.setValue("customerType", "broadband");
        form.setValue("branch", "");
        form.setValue("billingSchemaVersionId", "");
        setSelectedSchemaVersionId("");
        return;
      }

      const mappedType = CUSTOMER_TYPE_MAP[customer.customer_type] || "broadband";

      form.setValue("customerId", customer.id);
      form.setValue("customerName", customer.full_name);
      form.setValue("customerType", mappedType);
      form.setValue("branch", customer.branch_name || "");

      if (customer.billing_schema_version_id) {
        form.setValue("billingSchemaVersionId", customer.billing_schema_version_id);
        setSelectedSchemaVersionId(customer.billing_schema_version_id);
      } else {
        form.setValue("billingSchemaVersionId", "");
        setSelectedSchemaVersionId("");
      }
    };

    const handleSchemaChange = (val: string) => {
      form.setValue("billingSchemaVersionId", val);
      setSelectedSchemaVersionId(val);
    };

    const handleCustomerTypeChange = (val: string) => {
      form.setValue("customerType", val as "broadband" | "business" | "enterprise" | "corporate");
      form.setValue("billingSchemaVersionId", "");
      setSelectedSchemaVersionId("");
    };

    return (
      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("billing.invoice.billingInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t("billing.invoice.customer")}</FormLabel>
                      <FormControl>
                        <CustomerSelector
                          value={form.watch("customerId")}
                          onChange={handleCustomerSelect}
                          disabled={readOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("billing.invoice.customerType")}
                    </FormLabel>
                    <Select
                      onValueChange={handleCustomerTypeChange}
                      value={field.value}
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
                        <SelectItem value="enterprise">
                          {t("billing.report.enterprise")}
                        </SelectItem>
                        <SelectItem value="corporate">
                          {t("billing.report.corporate")}
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
                      value={field.value}
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
                name="billingSchemaVersionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("billing.schema.billingSchema", "Billing Schema")}</FormLabel>
                    <FormControl>
                      <SchemaVersionSelector
                        schemaType="billing"
                        customerType={customerType}
                        value={field.value || ""}
                        onChange={handleSchemaChange}
                        disabled={readOnly}
                      />
                    </FormControl>
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

          {appliedRules && !readOnly && (
            <>
              <Separator />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("billing.schema.appliedRules", "Applied Billing Schema Rules")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">OTC Type:</span>{" "}
                      <Badge variant="outline" className="capitalize">{appliedRules.otcType || "—"}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Grace Period:</span>{" "}
                      <Badge variant="outline">{appliedRules.gracePeriodDays ? `${appliedRules.gracePeriodDays} days` : "—"}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Late Fee:</span>{" "}
                      <Badge variant="outline">
                        {appliedRules.lateFee
                          ? appliedRules.lateFee.type === "percentage"
                            ? `${appliedRules.lateFee.value}%`
                            : `Rp ${appliedRules.lateFee.value.toLocaleString("id-ID")}`
                          : "None"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax Rate:</span>{" "}
                      <Badge variant="outline">{appliedRules.taxRate ? `${appliedRules.taxRate}%` : "—"}</Badge>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Payment Methods:</span>{" "}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(appliedRules.paymentMethods || []).map((m) => (
                          <Badge key={m} variant="secondary" className="capitalize text-xs">
                            {m.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

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
