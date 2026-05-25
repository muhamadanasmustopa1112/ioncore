"use client";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiMoneyDollarCircleLine } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PPPProfileFormData } from "../../../api/post-ppp-profile";

type SectionProps = {
    isDetailMode?: boolean;
    isPending?: boolean;
};

export function PricingCapacitySection({ isDetailMode, isPending }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<PPPProfileFormData>();

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiMoneyDollarCircleLine className="size-4 text-emerald-500" />
                <h3 className="text-sm font-semibold">{t("pppProfile.pricingCapacity", "Pricing & Capacity")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                <FormField
                    control={control}
                    name="capital_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.capitalPrice", "Capital Price")}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rp</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="sell_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.sellPrice", "Sell Price")}</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10 pl-9" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Rp</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="customer_count"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.customerCount", "Customer Count")}</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="voucher_count"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground">{t("pppProfile.voucherCount", "Voucher Count")}</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" disabled={isDetailMode || isPending} className="h-10" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    );
}
