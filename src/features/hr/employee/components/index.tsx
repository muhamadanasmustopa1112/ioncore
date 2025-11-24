"use client";

import { RiAddLine } from "@remixicon/react";
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
import { useEmployeeStore } from "../store/employee";
import { EmployeeList } from "./list/employee-list";
import { ContentHeader } from "@/components/common/content-header";

export function EmployeeListPage() {
  const { openEmployeeFormSheet } = useEmployeeStore();
  return (
    <>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>Employee</ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button type="button" onClick={() => openEmployeeFormSheet("new")}>
            <RiAddLine />
            Add New
          </Button>
        </ToolbarActions>
      </Toolbar>
      <EmployeeList />
    </>
  );
}
