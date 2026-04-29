"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RiSignalTowerLine,
    RiMapPinLine,
    RiInformationLine,
    RiCompass3Line,
    RiNodeTree,
    RiHashtag,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { DEFAULT_POP_VALUES, PopData, popSchema, type PopFormValues } from "../../types/pop";
import { usePopStore } from "../../store/pop";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useCreatePop } from "../../api/create-pop";
import { useUpdatePop } from "../../api/update-pop";

type PopFormProps = {
    mode: "new" | "edit" | "details";
    onSuccess?: () => void;
    popId?: string;
    readOnly?: boolean;
};

export type PopFormRef = {
    submit: () => void;
    isPending: boolean;
};

export const PopForm = forwardRef<PopFormRef, PopFormProps>(
    ({ onSuccess, popId, readOnly = false, mode }, ref) => {
        const { closePopFormSheet, selectedPop } = usePopStore();

        const { data: branches, isLoading: isLoadingBranches } = useBranchList();

        const data = selectedPop;

        const mapPopToFormValues = (pop: PopData): PopFormValues => {
            const branchId = pop.branch?.id || (pop as any).branchId || pop.branch?.id || "";

            let finalBranchId = branchId;
            if (!finalBranchId && pop.area && branches) {
                const matchingBranch = branches.find(
                    (b) => b.name === pop.area
                );
                if (matchingBranch) {
                    finalBranchId = matchingBranch.id;
                }
            }

            return {
                branch_id: finalBranchId,
                code: pop.code ?? "",
                gps_lat: pop.gps_lat?.toString() ?? "",
                gps_lng: pop.gps_lng?.toString() ?? "",
                name: pop.name,
                status: pop.status ?? "UP",
            };
        };

        const form = useForm<PopFormValues>({
            resolver: zodResolver(popSchema),
            values: (data && mode !== "new") ? mapPopToFormValues(data) : (DEFAULT_POP_VALUES as PopFormValues),
        });

        const { mutate: createPop, isPending: isCreating } = useCreatePop({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closePopFormSheet();
                    onSuccess?.();
                },
            },
        });

        const { mutate: updatePop, isPending: isUpdating } = useUpdatePop({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closePopFormSheet();
                    onSuccess?.();
                },
            },
        });

        const isPending = isCreating || isUpdating;

        useImperativeHandle(ref, () => ({
            submit: () => form.handleSubmit(onSubmit)(),
            isPending,
        }));

        const onSubmit = (formData: PopFormValues) => {
            if (mode === "edit" && popId) {
                updatePop({ id: popId, data: formData });
            } else {
                createPop(formData);
            }
        };

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col overflow-hidden">
                    <ScrollArea className="flex-1 px-6 py-6">
                        <div className="space-y-8 pb-6">
                            {/* General Info Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <RiSignalTowerLine className="size-4 text-blue-500" />
                                    <h3 className="text-sm font-semibold">General Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <FormField
                                        control={form.control}
                                        name="branch_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <RiNodeTree className="size-3" />
                                                    Branch
                                                </FormLabel>
                                                <Select
                                                    key={branches?.length + (form.getValues("branch_id") || "empty")}
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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

                            {/* Location Settings Section */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                    <RiCompass3Line className="size-4 text-purple-500" />
                                    <h3 className="text-sm font-semibold">Location Coordinates</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    <FormField
                                        control={form.control}
                                        name="gps_lat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <RiMapPinLine className="size-3" />
                                                    Latitude
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="-6.12345"
                                                        {...field}
                                                        disabled={readOnly || isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gps_lng"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <RiMapPinLine className="size-3" />
                                                    Longitude
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="106.12345"
                                                        {...field}
                                                        disabled={readOnly || isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </form>
            </Form>
        );
    }
);

PopForm.displayName = "PopForm";
