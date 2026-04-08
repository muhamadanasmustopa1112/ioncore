import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    RiGlobalLine,
    RiInformationLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useProfileGroupStore } from "../../store/profile-group";
import {
    DEFAULT_PROFILE_GROUP_VALUES,
    MOCK_PROFILE_GROUP_VALUES,
    profileGroupSchema,
    type ProfileGroupFormValues,
} from "../../types/profile-group";

import { toast } from "sonner";

export function ProfileGroupForm() {
    const { form: formMode, closeProfileGroupFormSheet } = useProfileGroupStore();
    const isEditMode = formMode === "edit";
    const isDetailMode = formMode === "details";

    const form = useForm<ProfileGroupFormValues>({
        resolver: zodResolver(profileGroupSchema),
        defaultValues: isEditMode || isDetailMode
            ? MOCK_PROFILE_GROUP_VALUES
            : DEFAULT_PROFILE_GROUP_VALUES,
    });


    function onSubmit(data: ProfileGroupFormValues) {
        console.log("Form Submitted:", data);
        toast.success(isEditMode ? "Profile group updated" : "Profile group created successfully");
        closeProfileGroupFormSheet();
    }

    return (
        <Form {...form}>
            <form
                id="profile-group-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-full flex-col overflow-hidden"
            >
                <ScrollArea className="flex-1 px-6 py-6">
                    <div className="space-y-8 pb-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <RiInformationLine className="size-4 text-blue-500" />
                                <h3 className="text-sm font-semibold">Profile Information</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="groupName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground">Profile Group Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Premium Home"
                                                    disabled={isDetailMode}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="dataOwner"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Data Owner</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isDetailMode}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Data Owner" />
                                                        </SelectTrigger>
                                                    </FormControl>
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
                                        control={form.control}
                                        name="routersNas"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Routers</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isDetailMode}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Router" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MikroTik-Bengkulu">MikroTik-Bengkulu</SelectItem>
                                                        <SelectItem value="Cisco-Jakarta">Cisco-Jakarta</SelectItem>
                                                        <SelectItem value="Juniper-NOC">Juniper-NOC</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Technical Configuration */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                                <RiGlobalLine className="size-4 text-purple-500" />
                                <h3 className="text-sm font-semibold">Technical Configuration</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground">Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isDetailMode}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="HOTSPOT">HOTSPOT</SelectItem>
                                                    <SelectItem value="PPP">PPP</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ipPoolModule"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground">IP Pool Module</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. GROUP ONLY"
                                                    disabled={isDetailMode}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="dnsServer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground">DNS Server</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 8.8.8.8"
                                                    disabled={isDetailMode}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="parentQueue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                Parent Queue
                                                {!isDetailMode && <span className="text-[10px] text-muted-foreground/60 font-normal">(Optional)</span>}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Optional"
                                                    disabled={isDetailMode}
                                                    {...field}
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



