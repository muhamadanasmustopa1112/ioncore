"use client";

import { useEffect } from "react";
import {
    RiInformationLine,
    RiMoneyDollarCircleLine,
    RiSettings4Line,
    RiCalendarEventLine,
    RiTimeLine,
    RiDatabase2Line
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
import { Checkbox } from "@/components/ui/checkbox";
import { usePPPProfileStore } from "../../store/ppp-profile";
import { TimeUnit } from "../../types";

const DAYS_OF_WEEK = [
    { id: "MONDAY", label: "MONDAY" },
    { id: "TUESDAY", label: "TUESDAY" },
    { id: "WEDNESDAY", label: "WEDNESDAY" },
    { id: "THURSDAY", label: "THURSDAY" },
    { id: "FRIDAY", label: "FRIDAY" },
    { id: "SATURDAY", label: "SATURDAY" },
    { id: "SUNDAY", label: "SUNDAY" },
];

const TIME_UNITS: TimeUnit[] = ["MINUTES", "HOURS", "DAYS", "WEEKS", "MONTHS"];

export function PPPProfileForm() {
    const { form, formData, setFormData } = usePPPProfileStore();
    const isDetailMode = form === "details";

    const handleInputChange = (field: string, value: any) => {
        setFormData({ [field]: value });
    };

    const toggleDay = (dayId: string) => {
        const current = [...formData.loginPeriod];
        if (current.includes(dayId)) {
            setFormData({ loginPeriod: current.filter(d => d !== dayId) });
        } else {
            setFormData({ loginPeriod: [...current, dayId] });
        }
    };

    const toggleAllDays = () => {
        if (formData.loginPeriod.length === 7) {
            setFormData({ loginPeriod: [] });
        } else {
            setFormData({ loginPeriod: DAYS_OF_WEEK.map(d => d.id) });
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-10 pb-10">

                    {/* General Information */}
                    <section className="space-y-5">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <RiInformationLine className="size-4 text-blue-600" />
                            </div>
                            <h3 className="font-black text-foreground">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-muted-foreground">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Profile Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="planeName" className="text-muted-foreground">Plan Name</Label>
                                <Input
                                    id="planeName"
                                    placeholder="Plan Name"
                                    value={formData.planeName}
                                    onChange={(e) => handleInputChange("planeName", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="dataOwner" className="text-muted-foreground">Data Owner</Label>
                                <div className="relative">
                                    <Input
                                        id="dataOwner"
                                        value={formData.dataOwner}
                                        onChange={(e) => handleInputChange("dataOwner", e.target.value)}
                                        disabled={isDetailMode}
                                        className="h-11 pl-10"
                                    />
                                    <RiDatabase2Line className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing & Tax Section */}
                    <section className="space-y-5">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <RiMoneyDollarCircleLine className="size-4 text-emerald-600" />
                            </div>
                            <h3 className="text-foreground">Pricing & Tax Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="capitalPrice" className="text-muted-foreground">Capital Price</Label>
                                <div className="relative">
                                    <Input
                                        id="capitalPrice"
                                        type="number"
                                        value={formData.capitalPrice}
                                        onChange={(e) => handleInputChange("capitalPrice", Number(e.target.value))}
                                        disabled={isDetailMode}
                                        className="h-11 pl-10"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">Rp</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="sellPrice" className="text-muted-foreground">Sell Price</Label>
                                <div className="relative">
                                    <Input
                                        id="sellPrice"
                                        type="number"
                                        value={formData.sellPrice}
                                        onChange={(e) => handleInputChange("sellPrice", Number(e.target.value))}
                                        disabled={isDetailMode}
                                        className="h-11 pl-10"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">Rp</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="promoPrice" className="text-muted-foreground">Promo Price</Label>
                                <div className="relative">
                                    <Input
                                        id="promoPrice"
                                        type="number"
                                        value={formData.promoPrice}
                                        onChange={(e) => handleInputChange("promoPrice", Number(e.target.value))}
                                        disabled={isDetailMode}
                                        className="h-11 pl-10"
                                    />
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">Rp</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="vat" className="text-muted-foreground">VAT (%)</Label>
                                <div className="relative">
                                    <Input
                                        id="vat"
                                        type="number"
                                        value={formData.vat}
                                        onChange={(e) => handleInputChange("vat", Number(e.target.value))}
                                        disabled={isDetailMode}
                                        className="h-11 pr-10"
                                    />
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Plan Settings Section */}
                    <section className="space-y-5">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                            <div className="p-1.5 bg-orange-500/10 rounded-lg">
                                <RiSettings4Line className="size-4 text-orange-600" />
                            </div>
                            <h3 className="text-foreground">Plan Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="profileGroup" className="text-muted-foreground">Profile Group</Label>
                                <Input
                                    id="profileGroup"
                                    placeholder="e.g. PLATINUM"
                                    value={formData.profileGroup}
                                    onChange={(e) => handleInputChange("profileGroup", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11 uppercase"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="bandwidth" className="text-muted-foreground">Bandwidth</Label>
                                <Input
                                    id="bandwidth"
                                    placeholder="e.g. 100M"
                                    value={formData.bandwidth}
                                    onChange={(e) => handleInputChange("bandwidth", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11 uppercase"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="priority" className="text-muted-foreground">Priority</Label>
                                <Input
                                    id="priority"
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => handleInputChange("priority", Number(e.target.value))}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                            <div className="space-y-2.5">
                                <Label htmlFor="planValidity" className="text-muted-foreground">Plan Validity</Label>
                                <Input
                                    id="planValidity"
                                    type="number"
                                    value={formData.planValidity}
                                    onChange={(e) => handleInputChange("planValidity", Number(e.target.value))}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-muted-foreground">Time Unit</Label>
                                <Select
                                    disabled={isDetailMode}
                                    value={formData.timeUnit}
                                    onValueChange={(val) => handleInputChange("timeUnit", val)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_UNITS.map(unit => (
                                            <SelectItem key={unit} value={unit} className="text-xs">{unit}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="sharedUsers" className="text-muted-foreground">Shared Users</Label>
                                <Input
                                    id="sharedUsers"
                                    type="number"
                                    value={formData.sharedUsers}
                                    onChange={(e) => handleInputChange("sharedUsers", Number(e.target.value))}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Schedule Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2.5 pb-2.5 border-b border-border/60">
                            <div className="p-1.5 bg-violet-500/10 rounded-lg">
                                <RiCalendarEventLine className="size-4 text-violet-600" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Login Period & Session Schedule</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-muted-foreground">Login Period</Label>
                                <button
                                    type="button"
                                    onClick={toggleAllDays}
                                    disabled={isDetailMode}
                                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    {formData.loginPeriod.length === 7 ? "Deselect All" : "Check All"}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {DAYS_OF_WEEK.map((day) => (
                                    <div key={day.id} className="flex items-center space-x-2.5 p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => !isDetailMode && toggleDay(day.id)}>
                                        <Checkbox
                                            id={day.id}
                                            checked={formData.loginPeriod.includes(day.id)}
                                            onCheckedChange={() => toggleDay(day.id)}
                                            disabled={isDetailMode}
                                        />
                                        <label
                                            htmlFor={day.id}
                                            className="cursor-pointer leading-none"
                                        >
                                            {day.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2.5">
                                <Label htmlFor="fromTime" className="text-muted-foreground flex items-center gap-1.5">
                                    <RiTimeLine className="size-3 text-emerald-500" />
                                    From Time
                                </Label>
                                <Input
                                    id="fromTime"
                                    type="time"
                                    value={formData.fromTime}
                                    onChange={(e) => handleInputChange("fromTime", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="toTime" className="text-muted-foreground flex items-center gap-1.5">
                                    <RiTimeLine className="size-3 text-rose-500" />
                                    To Time
                                </Label>
                                <Input
                                    id="toTime"
                                    type="time"
                                    value={formData.toTime}
                                    onChange={(e) => handleInputChange("toTime", e.target.value)}
                                    disabled={isDetailMode}
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </ScrollArea>
        </div>
    );
}
