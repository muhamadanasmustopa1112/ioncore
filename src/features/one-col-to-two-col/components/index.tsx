"use client";

import {
  RiAddLine,
  RiArrowRightUpLine,
  RiFileListLine,
  RiFolderForbidLine,
} from "@remixicon/react";
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useEmployeeStore } from "../store/employee";
import { EmployeeDetails } from "./details/employee-details";
import { EmployeeForm } from "./form/employee-form";
import { EmployeeFormCard } from "./form/employee-form-card";
import { EmployeeList } from "./list/employee-list";

export function EmployeeListPage() {
  const {
    openEmployeeFormSheet,
    employeeSheetOpen,
    closeEmployeeFormSheet,
    form,
  } = useEmployeeStore();

  const handleEmployeeFormClose = () => {
    closeEmployeeFormSheet();
  };

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
        role="complementary"
        aria-label="Employee panel"
        aria-hidden={!employeeSheetOpen}
        className={cn(
          "absolute top-0 right-0 z-0 flex h-full w-full flex-col md:relative md:h-auto",
          "transition-[transform,width] duration-300 ease-in-out",
          employeeSheetOpen
            ? "bg-body-background border-border translate-x-0 border-l md:pointer-events-auto md:w-1/2"
            : "translate-x-full md:pointer-events-none md:w-0 md:translate-x-0 md:border-0 md:bg-transparent",
        )}
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
          {form === "details" ? (
            <EmployeeDetails />
          ) : (
            <EmployeeFormCard
              mode={form || "new"}
              open={employeeSheetOpen}
              onOpenChange={handleEmployeeFormClose}
            />
          )}
        </div>
      </aside>
    </div>
  );
}
