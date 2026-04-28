"use client";

import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { PopDetailHeader } from "./components/pop-detail-header";
import { PopDetailKpi } from "./components/pop-detail-kpi";
import { PopDeviceInventoryTable } from "./list/pop-device-inventory-table";
import { PopOltTable } from "./list/pop-olt-table";
import { usePopStore } from "../../store/pop";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { RiArrowLeftLine, RiLoader2Line } from "@remixicon/react";
import { usePop } from "../../api/get-pop";
import { useEffect } from "react";

export function PopDetailView() {
    const router = useRouter();
    const params = useParams();
    const popId = params?.id as string;
    
    const { selectedPop, setSelectedPop } = usePopStore();

    // Fetch data POP jika belum ada di store tapi ada di URL
    const { data: popResponse, isLoading: isFetchingPop } = usePop({
        params: {
            id: popId || undefined
        },
        queryConfig: {
            enabled: !!popId && !selectedPop
        }
    });

    // Update store jika data berhasil di-fetch
    useEffect(() => {
        if (popResponse?.data?.[0] && !selectedPop) {
            setSelectedPop(popResponse.data[0]);
        }
    }, [popResponse, selectedPop, setSelectedPop]);

    if (isFetchingPop) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <RiLoader2Line className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Loading POP data...</p>
            </div>
        );
    }

    if (!selectedPop) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground font-medium text-lg">No POP data selected.</p>
                <Button onClick={() => router.push(paths.dashboard.networkAndOrchestration.odpPop.manage.path)}>
                    <RiArrowLeftLine className="mr-2" />
                    Back to List
                </Button>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col gap-y-6 overflow-y-auto px-6 py-4 bg-background custom-scrollbar">
            <PageBreadcrumb
                items={[
                    {
                        title: "Network & Orchestration",
                        path: paths.dashboard.networkAndOrchestration.root.getHref(),
                    },
                    {
                        title: "ODP & POP",
                        path: "/noc/odp-pop/manage"
                    },
                    { title: `POP Detail (${selectedPop.name})` },
                ]}
                className="mb-0"
            />

            <div className="flex flex-col gap-8 max-w-7xl pb-10">
                <PopDetailHeader pop={selectedPop} />

                <div className="space-y-10">
                    <PopDetailKpi pop={selectedPop} />
                    
                    <PopOltTable popId={String(selectedPop.id)} />
                    
                    <PopDeviceInventoryTable popId={String(selectedPop.id)} />
                </div>
            </div>
        </div>
    );
}
