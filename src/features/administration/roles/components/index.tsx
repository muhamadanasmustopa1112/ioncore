"use client";

import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine, RiShieldLine } from "@remixicon/react";
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
import { RoleList } from "./list/role-list";
import { useRoleStore } from "../store/role";
import { RoleDialog } from "./form/role-dialog";
import { useRoles } from "@/features/user-service/api/roles";

export function RoleListPage() {
  const { t } = useTranslation();
  const { openRoleDialog } = useRoleStore();
  const { data: rolesResp } = useRoles({ per_page: 1 });
  const totalRoles = rolesResp?.metadata?.total ?? rolesResp?.data?.length ?? 0;

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.administration"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.roles.title") },
        ]}
      />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("administration.roles.title")}
          </ToolbarTitle>
          <div className="mt-2.5 flex items-center gap-2.5 text-sm font-medium">
            <Badge variant="info" appearance="light" className="h-6 px-2.5 gap-1.5 border-none font-semibold">
              <RiShieldLine className="size-3.5" />
              {totalRoles} {t("administration.roles.roles")}
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground font-normal">
              {t("administration.roles.defineRoles")}
            </span>
          </div>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            {t("administration.roles.export")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openRoleDialog("new")}
          >
            <RiAddLine className="size-5" />
            {t("administration.roles.addNewRole")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="flex-1 overflow-auto mt-4">
        <RoleList />
      </div>

      <RoleDialog />
    </div>
  );
}
