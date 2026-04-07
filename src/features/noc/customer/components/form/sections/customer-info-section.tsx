"use client";

import {
    RiUserLine,
    RiContactsLine,
    RiMapPinLine,
    RiLockPasswordLine,
    RiStickyNoteLine,
    RiMapPinAddLine
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
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "../../../store/customer";

export function CustomerInfoSection() {
    const { formData, updateFormData, form } = useCustomerStore();
    const isDetailMode = form === "details";

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-8">
            {/* Identity Group */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <RiUserLine className="size-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Identity Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="odpPop" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">ODP | POP — Optional</Label>
                        <Select
                            value={formData.odpPop || "no odp | pop"}
                            onValueChange={(v) => handleChange("odpPop", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="odpPop">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no odp | pop">no odp | pop</SelectItem>
                                <SelectItem value="ODP-KMG-01">ODP-KMG-01</SelectItem>
                                <SelectItem value="ODP-KMG-02">ODP-KMG-02</SelectItem>
                                <SelectItem value="ODP-KMG-03">ODP-KMG-03</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customerId" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Customer ID</Label>
                        <Input
                            id="customerId"
                            placeholder="264719765770"
                            value={formData.customerId || ""}
                            onChange={(e) => handleChange("customerId", e.target.value)}
                            disabled={isDetailMode}
                        />

                        <p className="text-[10px] text-muted-foreground italic">LETTERS AND NUMBERS ONLY</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Name</Label>
                        <Input
                            id="name"
                            placeholder="Full Name"
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identityNo" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">ID Card | Driver Licence | Passport</Label>
                        <Input
                            id="identityNo"
                            placeholder="0000000000000000"
                            value={formData.identityNo || ""}
                            onChange={(e) => handleChange("identityNo", e.target.value)}
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
                        <Label htmlFor="mobile" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Mobile Phone</Label>
                        <div className="flex gap-2">
                            <div className="w-24">
                                <Select
                                    value={formData.countryCode || "+62"}
                                    onValueChange={(v) => handleChange("countryCode", v)}
                                    disabled={isDetailMode}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="+62" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="+62">+62 (ID)</SelectItem>
                                        <SelectItem value="+1">+1 (US)</SelectItem>
                                        <SelectItem value="+60">+60 (MY)</SelectItem>
                                        <SelectItem value="+65">+65 (SG)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                id="mobile"
                                className="flex-1"
                                placeholder="81234567890"
                                value={formData.mobile || ""}
                                onChange={(e) => handleChange("mobile", e.target.value)}
                                disabled={isDetailMode}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">International Phone Format</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Full Address"
                            className="min-h-[80px] resize-none"
                            value={formData.address || ""}
                            onChange={(e) => handleChange("address", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                </div>
            </div>

            {/* Location Group */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <RiMapPinLine className="size-4 text-rose-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wide">Location Coordinate</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="latitude" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Latitude — Optional</Label>
                            <Button variant="ghost" size="sm" className="h-6 text-primary hover:text-primary gap-1 px-1">
                                <RiMapPinAddLine className="size-3" />
                                Add Location Coordinate
                            </Button>
                        </div>
                        <Input
                            id="latitude"
                            placeholder="-0.0000000"
                            value={formData.latitude || ""}
                            onChange={(e) => handleChange("latitude", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-xs font-medium text-muted-foreground uppercase tracking-tight pt-1.5">Longitude — Optional</Label>
                        <Input
                            id="longitude"
                            placeholder="0.0000000"
                            value={formData.longitude || ""}
                            onChange={(e) => handleChange("longitude", e.target.value)}
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
                        <Label htmlFor="loginMethod" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Login Method</Label>
                        <Select
                            value={formData.loginMethod || "USERNAME AND PASSWORD"}
                            onValueChange={(v) => handleChange("loginMethod", v)}
                            disabled={isDetailMode}
                        >
                            <SelectTrigger id="loginMethod">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USERNAME AND PASSWORD">USERNAME AND PASSWORD</SelectItem>
                                <SelectItem value="PPPOE">PPPOE</SelectItem>
                                <SelectItem value="HOTSPOT">HOTSPOT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Username</Label>
                        <Input
                            id="username"
                            placeholder="u_264719765770@My.Net"
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
                        <Label htmlFor="confirmPassword" object-title="Confirm Password" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword || ""}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            disabled={isDetailMode}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientAreaPassword" object-title="Clientarea Password" className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Clientarea Password</Label>
                        <Input
                            id="clientAreaPassword"
                            type="password"
                            value={formData.clientAreaPassword || ""}
                            onChange={(e) => handleChange("clientAreaPassword", e.target.value)}
                            disabled={isDetailMode}
                        />
                        <p className="text-[9px] text-muted-foreground leading-tight mt-1">Please CONTACT US to get more information</p>
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
                        placeholder="Add some notes..."
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
