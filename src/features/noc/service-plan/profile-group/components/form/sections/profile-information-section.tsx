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
import { ProfileGroupFormData } from "../../../api/post-profile-group";
import { RouterItem } from "@/features/noc/router/types";
 
type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
    routers: RouterItem[];
    isLoadingRouters?: boolean;
};
 
export function ProfileInformationSection({ readOnly, isPending, routers, isLoadingRouters }: SectionProps) {
    const { t } = useTranslation();
    const { control } = useFormContext<ProfileGroupFormData>();
 
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">{t("nocProfileGroup.form.info.title", "Profile Information")}</h3>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.info.name", "Profile Group Name")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocProfileGroup.form.info.namePlaceholder", "e.g. Premium Home")} {...field} disabled={readOnly || isPending} />
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
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.info.code", "Code")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("nocProfileGroup.form.info.codePlaceholder", "e.g. PREMIUM_HOME")} {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="data_owner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.info.dataOwner", "Data Owner")}</FormLabel>
                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("nocProfileGroup.form.info.selectDataOwner", "Select Data Owner")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Sales Retail">{t("nocProfileGroup.form.info.salesRetail", "Sales Retail")}</SelectItem>
                                    <SelectItem value="Enterprise Solutions">{t("nocProfileGroup.form.info.enterpriseSolutions", "Enterprise Solutions")}</SelectItem>
                                    <SelectItem value="NOC Infrastructure">{t("nocProfileGroup.form.info.nocInfrastructure", "NOC Infrastructure")}</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="router_nas"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">{t("nocProfileGroup.form.info.routerNas", "Router Nas")}</FormLabel>
                            <Select disabled={readOnly || isPending || isLoadingRouters} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingRouters ? t("nocProfileGroup.form.info.loading", "Loading...") : t("nocProfileGroup.form.info.selectRouter", "Select Router")} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {routers.map((router: RouterItem) => (
                                        <SelectItem key={router.id} value={router.shortname}>
                                            {router.shortname}
                                        </SelectItem>
                                    ))}
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
