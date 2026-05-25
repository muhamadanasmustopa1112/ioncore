"use client";

import { useUsers } from "@/features/user-service/api/users";
import { RiAddLine, RiDownloadLine, RiTeamLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { paths } from "@/config/paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { useUserStore } from "../store/user";
import { UserFormSheet } from "./form/user-form-sheet";
import { UserList } from "./list/user-list";

export function UserListPage() {
  const { t } = useTranslation();
  const { openUserFormSheet } = useUserStore();
  const { data: usersResp } = useUsers({ per_page: 1 });
  const totalUsers = usersResp?.metadata?.total ?? usersResp?.data?.length ?? 0;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.administration"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.users.title") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("administration.users.title")}
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge
              variant="info"
              appearance="light"
              className="h-6 gap-1.5 border-none px-2.5 font-semibold"
            >
              <RiTeamLine className="size-3.5" />
              {totalUsers} {t("administration.users.users")}
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              {t("administration.users.manageUserAccounts")}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button
            variant="outline"
            className="h-11 px-5 font-semibold shadow-xs"
          >
            <RiDownloadLine className="size-4" />
            {t("administration.users.export")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openUserFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            {t("administration.users.addNewUser")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4 flex-1 overflow-auto">
        <UserList />
      </div>

      <UserFormSheet />
    </div>
  );
}
