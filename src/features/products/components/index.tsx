"use client";

import { useTranslation } from "react-i18next";
import { RiBox3Line } from "@remixicon/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { PlanList } from "./broadband-plans/plan-list";
import { AddonList } from "./addons/addon-list";
import { ServiceList } from "./enterprise-services/service-list";

export function ProductsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useQueryStates({
    tab: parseAsString.withDefault("broadband-plans"),
    search: parseAsString,
    branch: parseAsString,
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  function handleTabChange(value: string) {
    setParams({ tab: value, search: null, branch: null, page: 1, limit: 10 });
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: t("administration.productsPage.breadcrumbAdmin"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.productsPage.breadcrumbProducts") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t("administration.productsPage.title")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <RiBox3Line className="size-3.5" />
              {t("administration.productsPage.badge")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <Tabs value={params.tab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="broadband-plans">{t("administration.productsPage.tabBroadband")}</TabsTrigger>
            <TabsTrigger value="addons">{t("administration.productsPage.tabAddons")}</TabsTrigger>
            <TabsTrigger value="enterprise-services">{t("administration.productsPage.tabEnterprise")}</TabsTrigger>
          </TabsList>
          <TabsContent value="broadband-plans">
            <PlanList />
          </TabsContent>
          <TabsContent value="addons">
            <AddonList />
          </TabsContent>
          <TabsContent value="enterprise-services">
            <ServiceList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
