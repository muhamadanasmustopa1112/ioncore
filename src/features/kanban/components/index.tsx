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
import KanbanBoardComponent from "./kanban-board/kanban-board";

export function KanbanProject() {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div
        className={cn(
          "flex h-fit min-w-0 flex-1 flex-col transition-[padding] duration-300"
        )}
      >
        <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle>Kanban Board</ToolbarTitle>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Kanban Board</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </ToolbarHeading>
          <ToolbarActions>
            <Button type="button">
              <RiAddLine />
              Add New
            </Button>
          </ToolbarActions>
        </Toolbar>

        <KanbanBoardComponent />
      </div>
    </div>
  );
}
