"use client";

import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useEmployeeStore } from "../store/employee";
import { EmployeeList } from "./list/employee-list";

export function EmployeeListPage() {
  const { openEmployeeFormSheet } = useEmployeeStore();
  return (
    <div className="relative h-full w-full overflow-hidden">
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
  );
}
