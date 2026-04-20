"use client";

import { RiAddLine, RiDownloadLine, RiTeamLine } from "@remixicon/react";
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
import { UserList } from "./list/user-list";
import { useUserStore } from "../store/user";
import { UserFormSheet } from "./form/user-form-sheet";
import { useUsers } from "@/features/user-service/api/users";

export function UserListPage() {
  const { openUserFormSheet } = useUserStore();
  const { data: usersResp } = useUsers({ per_page: 1 });
  const totalUsers = usersResp?.metadata?.total ?? usersResp?.data?.length ?? 0;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "User Management" },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            User Management
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
              <RiTeamLine className="size-3.5" />
              {totalUsers} Users
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              Manage user accounts and role assignments
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            Export
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openUserFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            Add New User
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="flex-1 overflow-auto mt-4">
        <UserList />
      </div>

      <UserFormSheet />
    </div>
  );
}
