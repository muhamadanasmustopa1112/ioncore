"use client";

import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { RiSpeedLine } from "@remixicon/react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BandwidthFormData } from "../../../api/post-bandwidth";

type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
};

export function GranularRateSection({ readOnly, isPending }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<BandwidthFormData>();

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiSpeedLine className="size-4 text-purple-500" />
                <h3 className="text-sm font-semibold">{t("nocBandwidth.form.granular.title", "Granular Rate Configuration")}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Upload Rates */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("nocBandwidth.form.granular.uploadSpeed", "Upload Speed")}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="min_rate_up"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nocBandwidth.form.granular.minRateUp", "Min Rate Up")}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} disabled={readOnly || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="max_rate_up"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nocBandwidth.form.granular.maxRateUp", "Max Rate Up")}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} disabled={readOnly || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Download Rates */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("nocBandwidth.form.granular.downloadSpeed", "Download Speed")}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="min_rate_down"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nocBandwidth.form.granular.minRateDown", "Min Rate Down")}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} disabled={readOnly || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="max_rate_down"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nocBandwidth.form.granular.maxRateDown", "Max Rate Down")}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} disabled={readOnly || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
