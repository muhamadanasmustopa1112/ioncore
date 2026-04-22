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
import { BandwidthFormData } from "../../../api/post-bandwidth";
 
type SectionProps = {
    readOnly?: boolean;
    isPending?: boolean;
    mode: "new" | "edit" | "details";
};
 
export function GeneralInformationSection({ readOnly, isPending, mode }: SectionProps) {
    const { control } = useFormContext<BandwidthFormData>();
 
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiInformationLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">General Information</h3>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Bandwidth 10M" {...field} disabled={readOnly || isPending} />
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
                            <FormLabel>Plan Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. BW-10M" {...field} disabled={readOnly || isPending} />
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
                            <FormLabel>Data Owner</FormLabel>
                            <FormControl>
                                <Input placeholder="radius_admin" {...field} disabled={readOnly || isPending || mode === "details"} />
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
                            <FormLabel>Service Profile</FormLabel>
                            <Select disabled={readOnly || isPending} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Profile" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="residential">Residential</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
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
