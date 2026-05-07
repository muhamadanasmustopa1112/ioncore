"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useWorkOrderStore } from "../store/work-order";
import { WorkOrderList } from "./work-order-list";
import { DetailSheet } from "./detail-sheet";

export function WorkOrdersPage() {
  const openSheet = useWorkOrderStore((s) => s.openSheet);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Operations",
            path: paths.dashboard.operations.root.getHref(),
          },
          { title: "Work Orders" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Work Orders
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="primary"
            onClick={() => openSheet("create")}
            className="font-semibold"
          >
            <Plus className="size-4" />
            New Work Order
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-5">
        <WorkOrderList />
      </div>

      <DetailSheet />
    </div>
  );
}
