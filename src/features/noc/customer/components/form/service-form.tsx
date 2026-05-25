"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    RiInformationLine,
    RiServiceLine,
    RiMoneyDollarCircleLine,
    RiGlobalLine,
    RiArrowRightLine,
    RiArrowLeftLine,
    RiCheckLine,
} from "@remixicon/react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { CustomerInfoSection } from "./sections/customer-info-section";
import { ServiceConfigurationSection } from "./sections/service-configuration-section";
import { BillingCommercialsSection } from "./sections/billing-commercials-section";
import { ExpirationNetworkingSection } from "./sections/expiration-networking-section";

import { cn } from "@/lib/utils";
import { useCustomerStore } from "../../store/customer";
import { usePPPCustomer } from "../../api/post-ppp-customer";
import { useGetPPPCustomer } from "../../api/get-ppp-customer";
import { useUpdatePPPCustomer } from "../../api/put-ppp-customer";
import { CreatePPPCustomerRequest } from "../../types/ppp-customer";

const STEPS = [
    {
        id: 1,
        title: "Customer Info",
        key: "customerInfo",
        icon: RiInformationLine,
    },
    {
        id: 2,
        title: "Service Plan",
        key: "servicePlan",
        icon: RiServiceLine,
    },
    {
        id: 3,
        title: "Billing",
        key: "billing",
        icon: RiMoneyDollarCircleLine,
    },
    {
        id: 4,
        title: "Networking",
        key: "networking",
        icon: RiGlobalLine,
    },
];

export function CustomerForm() {
    const { t } = useTranslation();
    const { formData, form, selectedId, closeCustomerFormSheet, currentStep, setCurrentStep, updateFormData } = useCustomerStore();
    const isCreateMode = form === "new";
    const isEditMode = form === "edit";
    const isDetailsMode = form === "details";

    const { data: pppCustomerData, isLoading: isLoadingCustomer } = useGetPPPCustomer({
        id: selectedId || "",
    });

    useEffect(() => {
        if (pppCustomerData && (isEditMode || isDetailsMode)) {
            const customer = pppCustomerData;
            updateFormData({
                address: customer.address || "",
                auth_status: customer.auth_status,
                bandwidth: "",
                bind_mac: customer.bind_mac,
                created_at: customer.created_at,
                email: customer.email,
                expired_on: customer.expired_on,
                fullname: customer.fullname,
                mac_address: customer.mac_address || "",
                member_id: customer.member_id,
                method: customer.method?.toLowerCase() || "pppoe",
                nasporttype: customer.nasporttype,
                note: customer.note || "",
                owner_name: customer.owner_name,
                password: customer.password,
                payment_type: customer.payment_type,
                phonenumber: customer.phonenumber,
                plan_name: customer.plan_name,
                remote_address: customer.remote_address,
                renewed_on: customer.renewed_on,
                server_name: customer.server_name || "",
                servicetype: customer.servicetype,
                total: customer.total,
                trx_invoice: customer.trx_invoice,
                trx_status: customer.trx_status,
                username: customer.username,
            });
        }
    }, [pppCustomerData, isEditMode, isDetailsMode, updateFormData]);

    const createMutation = usePPPCustomer({
        mutationConfig: {
            onSuccess: () => {
                closeCustomerFormSheet();
            },
        },
    });

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        const payload: CreatePPPCustomerRequest = {
            address: formData.address || "",
            auth_status: formData.auth_status || "Enabled-Users",
            bandwidth: formData.bandwidth || "",
            bind_mac: formData.bind_mac || "NO",
            created_at: formData.created_at || "",
            email: formData.email || "",
            expired_on: formData.expired_on || "",
            fullname: formData.fullname || "",
            mac_address: formData.mac_address || "",
            member_id: formData.member_id || "",
            method: formData.method || "pppoe",
            nasporttype: formData.nasporttype || "Ethernet",
            note: formData.note || "",
            owner_name: formData.owner_name || "radius_admin",
            password: formData.password || "",
            payment_type: formData.payment_type || "POSTPAID",
            phonenumber: formData.phonenumber || "",
            plan_name: formData.plan_name || "",
            remote_address: formData.remote_address || "Automatic",
            renewed_on: formData.renewed_on || new Date().toISOString().slice(0, 19).replace('T', ' '),
            server_name: formData.server_name || "",
            servicetype: formData.servicetype || "Framed-User",
            total: formData.total || "0",
            trx_invoice: formData.trx_invoice || `INV-PPP-${Date.now()}`,
            trx_status: formData.trx_status || "UNPAID",
            username: formData.username || "",
        };

        createMutation.mutate(payload);
    };

    if (isLoadingCustomer && (isEditMode || isDetailsMode)) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isCreateMode) {
        return (
            <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-slate-950">
                <Tabs defaultValue="customer-info" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 border-b border-border/50 flex items-center justify-between">
                        <TabsList variant="line" className="justify-start border-none">
                            <TabsTrigger value="customer-info" className="gap-2">
                                <RiInformationLine className="size-4" />
                                {t("nocCustomer.form.steps.customerInfo", "Customer Info")}
                            </TabsTrigger>
                            <TabsTrigger value="service-plan" className="gap-2">
                                <RiServiceLine className="size-4" />
                                {t("nocCustomer.form.steps.servicePlan", "Service Plan")}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="customer-info" className="flex-1 p-0 m-0 overflow-hidden">
                        <ScrollArea className="h-full px-6 py-6">
                            <div className="pb-6">
                                <CustomerInfoSection />
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="service-plan" className="flex-1 p-0 m-0 overflow-hidden">
                        <ScrollArea className="h-full px-6 py-6">
                            <div className="space-y-8 pb-6">
                                <ServiceConfigurationSection />
                                <BillingCommercialsSection />
                                <ExpirationNetworkingSection />
                            </div>
                        </ScrollArea>
                    </TabsContent>

                </Tabs>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-slate-950">
            <div className="px-6 pt-4 pb-3 border-b border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded bg-primary/10 text-primary leading-none tracking-wider">
                            {t("nocCustomer.form.stepIndicator", { current: currentStep, total: STEPS.length })}
                        </span>
                        <div className="h-4 w-px bg-border mx-1" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {t(`nocCustomer.form.steps.${STEPS[currentStep - 1].key}`, STEPS[currentStep - 1].title)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "size-2 rounded-full transition-all duration-300",
                                        isActive ? "bg-primary w-6" :
                                            isCompleted ? "bg-emerald-500" : "bg-muted"
                                    )}
                                />
                            );
                        })}
                    </div>
                </div>
                <Progress value={(currentStep / STEPS.length) * 100} className="h-1" />
            </div>

            {/* Wizard Content with Framer Motion */}
            <div className="flex-1 relative overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="px-6 pt-2 pb-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                {currentStep === 1 && <CustomerInfoSection />}
                                {currentStep === 2 && <ServiceConfigurationSection />}
                                {currentStep === 3 && <BillingCommercialsSection />}
                                {currentStep === 4 && <ExpirationNetworkingSection />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </div>

            {/* Navigation Footer */}
            <div className="p-4 px-6 border-t border-border/50 bg-white dark:bg-slate-950 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1 || createMutation.isPending}
                    className="gap-2 h-10"
                >
                    <RiArrowLeftLine className="size-4" />
                    {t("nocCustomer.form.previous", "Previous")}
                </Button>
                <div className="flex items-center gap-3">
                    {currentStep < STEPS.length ? (
                        <Button onClick={handleNext} className="gap-2 h-10 px-6 font-bold shadow-lg shadow-primary/20">
                            {t("nocCustomer.form.continue", "Continue")}
                            <RiArrowRightLine className="size-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending}
                            className="gap-2 h-10 px-8 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                        >
                            {createMutation.isPending ? t("nocCustomer.form.creating", "Creating...") : t("nocCustomer.form.confirmCreate", "Confirm & Create")}
                            <RiCheckLine className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

