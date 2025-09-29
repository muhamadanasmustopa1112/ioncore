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
import { EmployeeListTwoColumnsCard } from "./list/employee-list-two-columns-card";

export function EmployeeListTwoColumnsCardPage() {
  const { openEmployeeFormSheet } = useEmployeeStore();
  return (
    <>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>Employee</ToolbarTitle>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Human Resources</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Employee</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ToolbarHeading>
        <ToolbarActions>
          <Button type="button" onClick={() => openEmployeeFormSheet("new")}>
            <RiAddLine />
            Add New
          </Button>
        </ToolbarActions>
      </Toolbar>

      <EmployeeListTwoColumnsCard />
    </>
  );
}
