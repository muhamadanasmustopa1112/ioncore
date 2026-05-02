"use client";

import { RiBox3Line } from "@remixicon/react";
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
  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          {
            title: "Administration",
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: "Products" },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Product Management
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <RiBox3Line className="size-3.5" />
              Broadband · Add-ons · Enterprise
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <Tabs defaultValue="broadband-plans">
          <TabsList>
            <TabsTrigger value="broadband-plans">Broadband Plans</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="enterprise-services">Enterprise Services</TabsTrigger>
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
