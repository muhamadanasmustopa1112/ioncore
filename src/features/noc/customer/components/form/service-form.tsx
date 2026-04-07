"use client";

import {
    RiInformationLine,
    RiServiceLine,
} from "@remixicon/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerInfoSection } from "./sections/customer-info-section";
import { ServiceConfigurationSection } from "./sections/service-configuration-section";
import { BillingCommercialsSection } from "./sections/billing-commercials-section";
import { ExpirationNetworkingSection } from "./sections/expiration-networking-section";

export function CustomerForm() {
    return (
        <div className="flex h-full flex-col overflow-hidden">
            <Tabs defaultValue="customer-info" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b border-border/50">
                    <TabsList variant="line" className="w-full justify-start">
                        <TabsTrigger value="customer-info" className="gap-2">
                            <RiInformationLine className="size-4" />
                            Customer Info
                        </TabsTrigger>
                        <TabsTrigger value="service-plan" className="gap-2">
                            <RiServiceLine className="size-4" />
                            Service Plan
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
