"use client";

import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { PopDetailHeader } from "./components/pop-detail-header";
import { PopDetailKpi } from "./components/pop-detail-kpi";
import { PopDeviceInventoryTable } from "./list/pop-device-inventory-table";
import { usePopStore } from "../../store/pop";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { OdpPopList } from "../list/odp-pop-list";
import { useState, useMemo } from "react";
import { usePop } from "../../api/get-pop";

export function PopDetailView() {
    const router = useRouter();
    const { selectedPop } = usePopStore();

    const [filter, setFilter] = useState({
        limit: 10,
        page: 1,
        search: "",
        sort_by: "name",
        sort_order: "asc" as "asc" | "desc",
    });

    const params = useMemo(() => ({
        limit: filter.limit,
        page: filter.page,
        search: filter.search,
        sort_by: filter.sort_by,
        sort_order: filter.sort_order,
    }), [filter]);

    const { data: popData, isLoading } = usePop({ params });

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

            <div className="flex flex-col gap-8 max-w-7xl">
                <PopDetailHeader pop={selectedPop} />

                <div className="space-y-8">
                    <PopDetailKpi pop={selectedPop} />
                    <OdpPopList
                        type='odp'
                        data={popData as any}
                        isLoading={isLoading}
                        filter={filter}
                        setFilter={setFilter}
                    />
                    <PopDeviceInventoryTable popId={String(selectedPop.id)} />
                </div>
            </div>
        </div>
    );
}
