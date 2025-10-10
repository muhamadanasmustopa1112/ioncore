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
import { EmployeeList } from "./list/employee-list";

export function EmployeeListPage() {
  const {
    openEmployeeFormSheet,
    employeeSheetOpen,
    closeEmployeeFormSheet,
    form,
  } = useEmployeeStore();

  return (
    <div className="relative grid h-full w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      <div className="flex h-fit min-w-0 flex-1 flex-col md:pr-4">
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
        role="complementary"
        aria-label="Employee panel"
        aria-hidden={!employeeSheetOpen}
        className={cn(
          "bg-background border-border flex transform-gpu flex-col border-l transition-all duration-300 ease-in-out will-change-transform",
          // Desktop (md+): selalu terlihat di grid column kedua
          "md:pointer-events-auto md:static md:col-start-2 md:row-start-1 md:translate-x-0 md:opacity-100",
          // Mobile/Tablet: overlay absolute sebagai drawer
          employeeSheetOpen
            ? "pointer-events-auto fixed inset-0 z-50 translate-x-0 opacity-100 md:absolute md:top-0 md:right-0 md:z-0 md:h-full md:w-full"
            : "pointer-events-none fixed inset-0 z-50 translate-x-full opacity-0 md:absolute md:top-0 md:right-0 md:z-0 md:h-full md:w-full",
        )}
      >
        <div className="relative flex-1 overflow-hidden">
          {/* Active content slides in from right when open */}
          <div
            className={cn(
              "absolute inset-0 transform-gpu transition-transform duration-300 ease-in-out will-change-transform",
              employeeSheetOpen ? "translate-x-0" : "translate-x-full",
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
              {form === "details" ? <EmployeeDetails /> : <EmployeeForm />}
            </div>
          </div>

          {/* Placeholder shows when idle; fades out when open */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-200 ease-in-out",
              employeeSheetOpen
                ? "pointer-events-none opacity-0"
                : "opacity-100",
            )}
          >
            <div className="flex h-full items-center justify-center p-5">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <RiFolderForbidLine />
                  </EmptyMedia>
                  <EmptyTitle>No Projects Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by
                    creating your first project.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button onClick={() => openEmployeeFormSheet("new")}>
                      Create Project
                    </Button>
                    <Button variant="outline">Import Project</Button>
                  </div>
                </EmptyContent>
                <Button
                  mode="link"
                  underline="dashed"
                  asChild
                  className="text-muted-foreground"
                  size="sm"
                >
                  <a href="#">
                    Learn More <RiArrowRightUpLine />
                  </a>
                </Button>
              </Empty>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
