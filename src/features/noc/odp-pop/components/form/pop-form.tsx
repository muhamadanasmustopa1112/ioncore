"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    RiSignalTowerLine,
    RiMapPinLine,
    RiInformationLine,
    RiCompass3Line,
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
import { DEFAULT_POP_VALUES, popSchema, type PopFormValues } from "../../types/pop";
import { usePopStore } from "../../store/pop";
import { useEffect } from "react";

export function PopForm() {
    const { form: formMode, selectedPop } = usePopStore();
    const isEditMode = formMode === "edit";

    const form = useForm<PopFormValues>({
        resolver: zodResolver(popSchema),
        defaultValues: isEditMode && selectedPop
            ? selectedPop
            : DEFAULT_POP_VALUES,
    });

    useEffect(() => {
        if (isEditMode && selectedPop) {
            form.reset(selectedPop);
        } else {
            form.reset(DEFAULT_POP_VALUES);
        }
    }, [isEditMode, selectedPop]);

    const onSubmit = (data: PopFormValues) => {
        console.log("Form submitted:", data);
    };

    return (
        <Form {...form}>
            <form
                id="pop-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full flex-col overflow-hidden"
            >
                <ScrollArea className="flex-1 px-6 py-6">
                    <div className="space-y-8 pb-6">
                        {/* General Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <RiSignalTowerLine className="size-4 text-blue-500" />
                                <h3 className="text-sm font-semibold">General Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground">POP Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="POP JAKARTA PUSAT"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground">Area</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Jakarta Selatan"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="warning">Warning</SelectItem>
                                                <SelectItem value="down">Down</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Location Settings Section */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                <RiCompass3Line className="size-4 text-purple-500" />
                                <h3 className="text-sm font-semibold">Location Coordinates</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                <RiMapPinLine className="size-3" />
                                                Latitude
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    step="any"
                                                    placeholder="-6.12345"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                <RiMapPinLine className="size-3" />
                                                Longitude
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    step="any"
                                                    placeholder="106.12345"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
