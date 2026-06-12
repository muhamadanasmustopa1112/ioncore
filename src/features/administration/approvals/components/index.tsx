"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { PERMISSIONS } from "@/config/permissions";
import { useCan } from "@/lib/permissions";
import { SchemaApprovalTab } from "./schema-approval-tab";
import { ProductApprovalTab } from "./product-approval-tab";

export function ApprovalCenterPage() {
  const { t } = useTranslation();
  const canSchema = useCan(PERMISSIONS.schema.approve);
  const canProduct = useCan(PERMISSIONS.product.approve);

  const defaultTab = useMemo(() => {
    if (canSchema) return "schema";
    if (canProduct) return "products";
    return "schema";
  }, [canSchema, canProduct]);

  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="flex flex-col gap-6 p-4">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.administration"),
            path: paths.dashboard.administration.branch.root.getHref(),
          },
          { title: t("administration.approvalCenter.title") },
        ]}
      />

      <Toolbar className="items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl flex items-center gap-2">
            <ClipboardCheck className="size-6 text-primary" />
            {t("administration.approvalCenter.title")}
          </ToolbarTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {t("administration.approvalCenter.description")}
          </p>
        </ToolbarHeading>
      </Toolbar>

      <Card>
        <CardHeader>
          <CardHeading>
            <Badge variant="secondary" appearance="light">
              {t("administration.approvalCenter.pendingBadge")}
            </Badge>
          </CardHeading>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              {canSchema && (
                <TabsTrigger value="schema">
                  {t("administration.approvalCenter.tabSchema")}
                </TabsTrigger>
              )}
              {canProduct && (
                <TabsTrigger value="products">
                  {t("administration.approvalCenter.tabProducts")}
                </TabsTrigger>
              )}
            </TabsList>

            {canSchema && (
              <TabsContent value="schema" className="mt-4">
                <SchemaApprovalTab />
              </TabsContent>
            )}
            {canProduct && (
              <TabsContent value="products" className="mt-4">
                <ProductApprovalTab />
              </TabsContent>
            )}

            {!canSchema && !canProduct && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("administration.approvalCenter.noPermissions")}
              </p>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
