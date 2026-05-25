"use client";

import { Users, UserPlus, ClipboardList, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function CrmKpiCards() {
  const { t } = useTranslation();
  
  const kpiCards = [
    {
      title: t("common.totalActiveCustomers"),
      value: "12,450",
      change: "+12%",
      positive: true,
      icon: Users,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: t("common.totalPotentialLeads"),
      value: "842",
      change: "+5%",
      positive: true,
      icon: UserPlus,
      iconClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/20",
    },
    {
      title: t("common.ongoingWorkOrders"),
      value: "156",
      change: "-2%",
      positive: false,
      icon: ClipboardList,
      iconClass: "bg-orange-50 text-orange-600 dark:bg-orange-900/20",
    },
    {
      title: t("common.totalSalesDeals"),
      value: "$245.8k",
      change: "+18%",
      positive: true,
      icon: CreditCard,
      iconClass: "bg-green-50 text-green-600 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`rounded-lg p-2 ${kpi.iconClass}`}>
                  <Icon className="size-5" />
                </span>
                <Badge
                  variant={kpi.positive ? "success" : "destructive"}
                  appearance="light"
                  size="md"
                >
                  {kpi.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}