"use client";

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
import { ProfileGroupList } from "./list/profile-group-list";
import { useProfileGroupStore } from "../store/profile-group";
import { ProfileGroupFormSheet } from "./form/profile-group-form-sheet";

export function ProfileGroupListPage() {
    const { openProfileGroupFormSheet } = useProfileGroupStore();

    return (
        <div className="relative h-full w-full overflow-hidden px-6 py-3">
            <PageBreadcrumb
                items={[
                    {
                        title: "Network & Orchestration",
                        path: paths.dashboard.networkAndOrchestration.root.getHref(),
                    },
                    { title: "ION Radius" },
                    { title: "Service Plan" },
                    { title: "Profile Group" },
                ]}
            />
            <Toolbar className="mt-5 items-center">
                <ToolbarHeading>
                    <ToolbarTitle className="text-2xl font-extrabold tracking-tight">Profile Group</ToolbarTitle>
                    <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
                        <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
                            <RiInformationLine className="size-3.5" />
                            Refresh Table: 1m
                        </Badge>
                        <span className="text-muted-foreground/60">•</span>
                        <span className="text-muted-foreground font-normal">Ping check every 5 minutes by system</span>
                    </div>
                </ToolbarHeading>
                <ToolbarActions>
                    <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
                        <RiDownloadLine className="size-4" />
                        Export Data
                    </Button>
                    <Button
                        variant="primary"
                        className="h-11 px-6 font-semibold shadow-md"
                        onClick={() => openProfileGroupFormSheet("new")}
                    >
                        <RiAddLine className="size-5" />
                        Add New Profile Group
                    </Button>
                </ToolbarActions>
            </Toolbar>

            <div className="flex-1 overflow-auto mt-4">
                <ProfileGroupList />
            </div>

            <ProfileGroupFormSheet />
        </div>
    );
}
