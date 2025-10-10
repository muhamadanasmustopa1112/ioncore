"use client";

import { RiAddLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
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
import { EmployeeDetail } from "./detail";
import { EmployeeDetails } from "./details/employee-details";
import { EmployeeForm } from "./form/employee-form";
import { EmployeeList } from "./list/employee-list";

export function EmployeeListPage() {
  const {
    openEmployeeFormSheet,
    employeeSheetOpen,
    closeEmployeeFormSheet,
    form,
  } = useEmployeeStore();

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div
        className={cn(
          "flex h-fit min-w-0 flex-1 flex-col transition-[padding] duration-300",
          employeeSheetOpen && "md:pr-4",
        )}
      >
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

        <EmployeeList />
      </div>

      <aside
        data-state={employeeSheetOpen ? "open" : "closed"}
        aria-hidden={!employeeSheetOpen}
        className={cn(
          // "absolute right-0 top-0 z-0 h-full w-full md:relative flex flex-col",
          "absolute top-0 right-0 z-0 flex h-auto w-full flex-col justify-stretch md:relative",
          "transition-[transform,width] duration-300 ease-in-out",
          employeeSheetOpen
            ? "bg-background border-border border-l md:pointer-events-auto md:w-[720px]"
            : "md:pointer-events-none md:w-0 md:border-0 md:bg-transparent",
          "data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
        )}
        role="complementary"
        aria-label="Employee panel"
      >
        <div className="border-border flex shrink-0 items-center justify-between border-b px-5 py-3.5">
          <div className="text-base font-medium">
            {form === "new" && "New Employee"}
            {form === "edit" && "Edit Employee"}
            {form === "details" && "Employee Detail"}
          </div>
          <Button variant="ghost" onClick={closeEmployeeFormSheet}>
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {form === "details" ? <EmployeeDetails /> : <EmployeeForm />}
        </div>
      </aside>
    </div>
  );
}
