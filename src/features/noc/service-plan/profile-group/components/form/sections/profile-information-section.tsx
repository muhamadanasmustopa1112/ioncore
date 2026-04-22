"use client";
 
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
    const { control } = useFormContext<ProfileGroupFormData>();
 
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Profile Information</h3>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs text-muted-foreground uppercase">Profile Group Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Premium Home" {...field} disabled={readOnly || isPending} />
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
                            <FormLabel className="text-xs text-muted-foreground uppercase">Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. PREMIUM_HOME" {...field} disabled={readOnly || isPending} />
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
                            <FormLabel className="text-xs text-muted-foreground uppercase">Data Owner</FormLabel>
                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select Data Owner" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Sales Retail">Sales Retail</SelectItem>
                                    <SelectItem value="Enterprise Solutions">Enterprise Solutions</SelectItem>
                                    <SelectItem value="NOC Infrastructure">NOC Infrastructure</SelectItem>
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
                            <FormLabel className="text-xs text-muted-foreground uppercase">Router Nas</FormLabel>
                            <Select disabled={readOnly || isPending || isLoadingRouters} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingRouters ? "Loading..." : "Select Router"} />
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
