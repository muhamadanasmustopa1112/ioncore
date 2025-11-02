"use client";

import { useRouter } from "next/navigation";
import { RiAddLine } from "@remixicon/react";
import { paths } from "@/config/paths";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { EmployeeList } from "./list/employee-list";

export function EmployeeListPage() {
  const router = useRouter();

  const onAddClick = () => {
    router.push(paths.dashboard.oneColNewPage.create.getHref());
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>Employee</ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button type="button" onClick={onAddClick}>
            <RiAddLine />
            Add New
          </Button>
        </ToolbarActions>
      </Toolbar>

      <EmployeeList />
    </div>
  );
}
