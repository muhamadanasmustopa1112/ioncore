"use client";

import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useCpqStore } from "../store/cpq";
import { PreBoqList } from "./pre-boq/pre-boq-list";
import { RfqList } from "./rfq/rfq-list";
import { BoqList } from "./boq/boq-list";
import { QuotationList } from "./quotation/quotation-list";

export function CpqPage() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useCpqStore();

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-4">
      <PageBreadcrumb
        items={[
          { title: t("menu.enterprise", "Enterprise System"), path: paths.dashboard.enterprise.root.getHref() },
          { title: t("enterprise.cpq.title", "CPQ / BOQ") },
        ]}
      />
      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("enterprise.cpq.title", "CPQ / BOQ")}
          </ToolbarTitle>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" appearance="light" className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs">
              <FileText className="size-3.5" />
              {t("enterprise.cpq.badge", "Configure, Price, Quote")}
            </Badge>
          </div>
        </ToolbarHeading>
      </Toolbar>
      <div className="mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pre-boq">{t("enterprise.cpq.tabPreBoq", "Pre-BoQ")}</TabsTrigger>
            <TabsTrigger value="rfq">{t("enterprise.cpq.tabRfq", "RFQ")}</TabsTrigger>
            <TabsTrigger value="boq">{t("enterprise.cpq.tabBoq", "BoQ")}</TabsTrigger>
            <TabsTrigger value="quotation">{t("enterprise.cpq.tabQuotation", "Quotation")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pre-boq">
            <PreBoqList />
          </TabsContent>
          <TabsContent value="rfq">
            <RfqList />
          </TabsContent>
          <TabsContent value="boq">
            <BoqList />
          </TabsContent>
          <TabsContent value="quotation">
            <QuotationList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
