"use client";

import {
    RiUserLine,
    RiContactsLine,
    RiLockPasswordLine,
    RiStickyNoteLine,
} from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCustomerStore } from "../../../store/customer";

export function CustomerInfoSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Identity Group */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <RiUserLine className="size-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Identity Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="member_id" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Member ID / Customer ID</Label>
                        <Input
                            id="member_id"
                            placeholder="MBR-PPP-001"
                            value={formData.member_id || ""}
                            onChange={(e) => handleChange("member_id", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Full Name</Label>
                        <Input
                            id="fullname"
                            placeholder="PPP Demo User"
                            value={formData.fullname || ""}
                            onChange={(e) => handleChange("fullname", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Group */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <RiContactsLine className="size-4 text-emerald-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="phonenumber" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Phone Number</Label>
                        <Input
                            id="phonenumber"
                            placeholder="081298765432"
                            value={formData.phonenumber || ""}
                            onChange={(e) => handleChange("phonenumber", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ppp@example.com"
                            value={formData.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Jl. Demo PPP No. 2"
                            className="min-h-[80px] resize-none"
                            value={formData.address || ""}
                            onChange={(e) => handleChange("address", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>
            </div>

            {/* Login Credentials Group */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <RiLockPasswordLine className="size-4 text-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Login Credentials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="method" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Login Method</Label>
                        <Select
                            value={formData.method || "pppoe"}
                            onValueChange={(v) => handleChange("method", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="method">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pppoe">pppoe</SelectItem>
                                <SelectItem value="hotspot">hotspot</SelectItem>
                                <SelectItem value="static">static</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Username</Label>
                        <Input
                            id="username"
                            placeholder="subscriber_username"
                            value={formData.username || ""}
                            onChange={(e) => handleChange("username", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={formData.password || ""}
                            onChange={(e) => handleChange("password", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="owner_name" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Owner Name</Label>
                        <Input
                            id="owner_name"
                            placeholder="radius_admin"
                            value={formData.owner_name || "radius_admin"}
                            onChange={(e) => handleChange("owner_name", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>
            </div>

            {/* Note Group */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <RiStickyNoteLine className="size-4 text-slate-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Additional Information</h3>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="note" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Note — Optional</Label>
                    <Textarea
                        id="note"
                        placeholder="created from Postman"
                        className="min-h-[80px] resize-none"
                        value={formData.note || ""}
                        onChange={(e) => handleChange("note", e.target.value)}
                        disabled={isDetailMode}
                    />
                </div>
            </div>
        </div>
    );
}
