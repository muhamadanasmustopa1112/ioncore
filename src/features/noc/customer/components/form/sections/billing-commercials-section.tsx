"use client";

import { useTranslation } from "react-i18next";
import { RiMoneyDollarCircleLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCustomerStore } from "../../../store/customer";

export function BillingCommercialsSection() {
    const { t } = useTranslation();
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
                <RiMoneyDollarCircleLine className="size-4 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide">{t("nocCustomer.form.billing.title", "Billing & Commercials")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-2">
                    <Label htmlFor="total" className="text-xs font-medium text-muted-foreground uppercase tracking-tight text-primary">{t("nocCustomer.form.billing.totalAmount", "Total Amount (Final Price)")}</Label>
                    <Input
                        id="total"
                        type="number"
                        placeholder="e.g. 150000"
                        className="font-bold text-lg"
                        value={formData.total || ""}
                        onChange={(e) => handleChange("total", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="trx_status" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{t("nocCustomer.form.billing.trxStatus", "Transaction Status")}</Label>
                    <Select value={formData.trx_status || "UNPAID"} onValueChange={(v) => handleChange("trx_status", v)} disabled={isDetailMode}>
                        <SelectTrigger id="trx_status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UNPAID">UNPAID</SelectItem>
                            <SelectItem value="PAID">PAID</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="trx_invoice" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{t("nocCustomer.form.billing.invoiceNumber", "Invoice Number")}</Label>
                    <Input
                        id="trx_invoice"
                        placeholder="INV-PPP-001"
                        value={formData.trx_invoice || ""}
                        onChange={(e) => handleChange("trx_invoice", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>
            </div>

            <div className="md:col-span-2 p-3 bg-primary/5 rounded border border-primary/10">
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                    <span className="font-bold text-primary italic underline">{t("nocCustomer.form.billing.nominalWriting", "Nominal Writing :")}</span> {t("nocCustomer.form.billing.nominalWritingHint", "Without thousands separator, use dot (.) for fractions.")}
                </p>
            </div>
        </div>
    );
}
