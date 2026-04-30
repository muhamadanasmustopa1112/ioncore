"use client";

import { useFormContext } from "react-hook-form";
import {
    RiSignalTowerLine,
    RiInformationLine,
    RiNodeTree,
    RiHashtag,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { BranchData } from "@/features/administration/branch/types";
import { PopFormValues } from "../../../types/pop";

type GeneralInfoSectionProps = {
    branches?: BranchData[];
    isLoadingBranches: boolean;
    readOnly: boolean;
    isPending: boolean;
};

export function GeneralInfoSection({
    branches,
    isLoadingBranches,
    readOnly,
    isPending,
}: GeneralInfoSectionProps) {
    const { control, getValues } = useFormContext<PopFormValues>();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <RiSignalTowerLine className="size-4 text-blue-500" />
                <h3 className="text-sm font-semibold">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                    control={control}
                    name="branch_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiNodeTree className="size-3" />
                                Branch
                            </FormLabel>
                            <Select
                                key={branches?.length + (getValues("branch_id") || "empty")}
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isLoadingBranches || readOnly || isPending}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select Branch"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {branches?.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiHashtag className="size-3" />
                                Code
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="POP-001" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground">POP Name</FormLabel>
                            <FormControl>
                                <Input placeholder="POP JAKARTA PUSAT" {...field} disabled={readOnly || isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                <RiInformationLine className="size-3" />
                                Status
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={readOnly || isPending}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="UP">Up</SelectItem>
                                    <SelectItem value="DOWN">Down</SelectItem>
                                    <SelectItem value="DEGRADED">Degraded</SelectItem>
                                    <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
