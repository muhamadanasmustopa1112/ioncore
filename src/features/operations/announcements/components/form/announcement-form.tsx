"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAnnouncementStore } from "../../store/announcement";
import { dummyBranches } from "../../data/dummy-announcements";
import { useCreateAnnouncement } from "../../api/post-announcement";
import type { AnnouncementFormData, AnnouncementTargetRole, AnnouncementChannel } from "../../types";

const ROLES: { value: AnnouncementTargetRole; label: string }[] = [
  { value: "operations_admin", label: "Operations Admin" },
  { value: "noc_manager", label: "NOC Manager" },
  { value: "noc", label: "NOC" },
  { value: "team_leader", label: "Team Leader" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "management", label: "Management" },
];

const CHANNELS: { value: AnnouncementChannel; label: string }[] = [
  { value: "in_app", label: "In-App" },
  { value: "email", label: "Email" },
];

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required"),
  priority: z.enum(["normal", "urgent"]),
  target_roles: z.array(z.enum(["operations_admin", "noc_manager", "noc", "team_leader", "finance_manager", "sales_manager", "management"])).min(1, "Select at least one role"),
  target_branches: z.array(z.string()).min(1, "Select at least one branch"),
  channels: z.array(z.enum(["in_app", "email"])).min(1, "Select at least one channel"),
  expires_at: z.string().min(1, "Expiry date is required"),
});

type Props = { mode: "new" | "edit" | "details"; onSuccess?: () => void };

export type AnnouncementFormRef = { submit: () => void; isPending: boolean };

export const AnnouncementForm = forwardRef<AnnouncementFormRef, Props>(
  ({ onSuccess, mode }, ref) => {
    const { closeFormSheet, selectedAnnouncement } = useAnnouncementStore();
    const data = selectedAnnouncement;
    const readOnly = mode === "details";
    const isVerticalSidebar = process.env.NEXT_PUBLIC_SIDEBAR === "vertical";

    const form = useForm<AnnouncementFormData>({
      resolver: zodResolver(schema),
      values: data && mode !== "new"
        ? {
            title: data.title, body: data.body, priority: data.priority,
            target_roles: data.target_roles, target_branches: data.target_branches,
            channels: data.channels, expires_at: data.expires_at?.slice(0, 16) || "",
          }
        : {
            title: "", body: "", priority: "normal" as const,
            target_roles: [], target_branches: [], channels: ["in_app" as const], expires_at: "",
          },
    });

    const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();

    useImperativeHandle(ref, () => ({
      submit: () => { form.handleSubmit(onSubmit)(); },
      isPending,
    }));

    const onSubmit = (formData: AnnouncementFormData) => {
      createAnnouncement(formData, {
        onSuccess: () => {
          toast.success("Announcement created successfully");
          closeFormSheet();
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to create announcement");
        },
      });
    };

    const disabled = readOnly || isPending;

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardContent className="p-0 flex flex-col h-full overflow-hidden">
              <div className={cn("flex h-full grow flex-wrap px-3.5", { "lg:flex-nowrap": !isVerticalSidebar })}>
                <div className={cn("grow py-5", { "border-border lg:border-s": !isVerticalSidebar })}>
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6 pb-6">
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter announcement title" maxLength={200} {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="body" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter announcement content..." className="min-h-[150px] resize-none" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="priority" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <FormControl>
                            <RadioGroup value={field.value} onValueChange={field.onChange} disabled={disabled} className="flex gap-6">
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="normal" id="priority-normal" />
                                <Label htmlFor="priority-normal" className="font-normal">Normal</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="urgent" id="priority-urgent" />
                                <Label htmlFor="priority-urgent" className="font-normal">Urgent</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="target_roles" render={() => (
                        <FormItem>
                          <FormLabel>Target Roles *</FormLabel>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {ROLES.map((role) => (
                              <Controller key={role.value} control={form.control} name="target_roles" render={({ field }) => {
                                const checked = field.value.includes(role.value);
                                return (
                                  <div className="flex items-center gap-2">
                                    <Checkbox id={`role-${role.value}`} checked={checked} disabled={disabled}
                                      onCheckedChange={() => field.onChange(checked ? field.value.filter((r) => r !== role.value) : [...field.value, role.value])} />
                                    <Label htmlFor={`role-${role.value}`} className="font-normal text-sm">{role.label}</Label>
                                  </div>
                                );
                              }} />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="target_branches" render={() => (
                        <FormItem>
                          <FormLabel>Target Branches *</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {dummyBranches.map((branch) => (
                              <Controller key={branch} control={form.control} name="target_branches" render={({ field }) => {
                                const checked = field.value.includes(branch);
                                return (
                                  <div className="flex items-center gap-2">
                                    <Checkbox id={`branch-${branch}`} checked={checked} disabled={disabled}
                                      onCheckedChange={() => field.onChange(checked ? field.value.filter((b) => b !== branch) : [...field.value, branch])} />
                                    <Label htmlFor={`branch-${branch}`} className="font-normal text-sm">{branch}</Label>
                                  </div>
                                );
                              }} />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="channels" render={() => (
                        <FormItem>
                          <FormLabel>Channels *</FormLabel>
                          <div className="flex gap-6">
                            {CHANNELS.map((ch) => (
                              <Controller key={ch.value} control={form.control} name="channels" render={({ field }) => {
                                const checked = field.value.includes(ch.value);
                                return (
                                  <div className="flex items-center gap-2">
                                    <Checkbox id={`channel-${ch.value}`} checked={checked} disabled={disabled}
                                      onCheckedChange={() => field.onChange(checked ? field.value.filter((v) => v !== ch.value) : [...field.value, ch.value])} />
                                    <Label htmlFor={`channel-${ch.value}`} className="font-normal text-sm">{ch.label}</Label>
                                  </div>
                                );
                              }} />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="expires_at" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expires At *</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} disabled={disabled} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  },
);

AnnouncementForm.displayName = "AnnouncementForm";
