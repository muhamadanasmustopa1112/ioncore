"use client";

import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiInformationLine } from "@remixicon/react";
import {
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
import { BandwidthFormData } from "../../../api/post-bandwidth";

type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
    mode: "new" | "edit" | "details";
};

export function GeneralInformationSection({ readOnly, isPending, mode }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<BandwidthFormData>();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">{t("nocBandwidth.form.general.title", "General Information")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("nocBandwidth.form.general.planName", "Plan Name")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocBandwidth.form.general.planNamePlaceholder", "e.g. Bandwidth 10M")} {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("nocBandwidth.form.general.planCode", "Plan Code")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocBandwidth.form.general.planCodePlaceholder", "e.g. BW-10M")} {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="data_owner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("nocBandwidth.form.general.dataOwner", "Data Owner")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocBandwidth.form.general.dataOwnerPlaceholder", "radius_admin")} {...field} disabled={readOnly || isPending || mode === "details"} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="attributes.service_profile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("nocBandwidth.form.general.serviceProfile", "Service Profile")}</FormLabel>
                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("nocBandwidth.form.general.selectProfile", "Select Profile")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="residential">{t("nocBandwidth.form.general.residential", "Residential")}</SelectItem>
                                    <SelectItem value="business">{t("nocBandwidth.form.general.business", "Business")}</SelectItem>
                                    <SelectItem value="enterprise">{t("nocBandwidth.form.general.enterprise", "Enterprise")}</SelectItem>
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
