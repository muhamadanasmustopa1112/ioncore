"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine, RiInformationLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Toolbar,
    ToolbarActions,
    ToolbarHeading,
    ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { CustomerList } from "./list/customer-list";
import { CustomerKpiCards } from "./customer-kpi-cards";

export function CustomerListPage() {
    const { t } = useTranslation();

    return (
        <div className="relative h-full w-full overflow-hidden px-6 py-3">
            <PageBreadcrumb
                items={[
                    {
                        title: t("menu.networkOrchestration", "Network & Orchestration"),
                        path: paths.dashboard.networkAndOrchestration.root.getHref(),
                    },
                    { title: t("menu.ionRadius", "ION Radius") },
                    { title: t("nocCustomer.title", "Customer") },
                ]}
            />
            <Toolbar className="mt-5 items-center">
                <ToolbarHeading>
                    <ToolbarTitle className="text-2xl font-extrabold tracking-tight">{t("nocCustomer.title", "Customer")}</ToolbarTitle>
                    <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
                        <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
                            <RiInformationLine className="size-3.5" />
                            {t("nocCustomer.refreshTable", "Refresh Table: 1m")}
                        </Badge>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground font-normal">{t("nocCustomer.pingCheckText", "Ping check every 5 minutes by system")}</span>
                    </div>
                </ToolbarHeading>
                <ToolbarActions>
                    <Button
                        variant="primary"
                        className="h-11 px-6 font-semibold shadow-md"
                        asChild
                    >
                        <Link href={paths.dashboard.networkAndOrchestration.customer.create.getHref()}>
                            <RiAddLine className="size-5" />
                            {t("nocCustomer.addNewCustomer", "Add New Customer")}
                        </Link>
                    </Button>
                </ToolbarActions>
            </Toolbar>

            <CustomerKpiCards />

            <div className="flex-1 overflow-auto mt-4">
                <CustomerList />
            </div>
        </div>
    );
}
