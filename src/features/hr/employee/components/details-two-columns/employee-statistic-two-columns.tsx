/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function EmployeeStatisticTwoColumns({}: object) {
  const items = [
    {
      total: "1,246",
      label: "Total Orders",
      badgeLabel: "23.08",
      badgeColor: "success",
      text: "Annual trend",
      number: "",
      icon: <TrendingUp />,
    },
    {
      total: "$89,378",
      label: "Cumulative Spend",
      badgeLabel: "3.82",
      badgeColor: "success",
      text: "Monthly trend",
      number: ".02",
      icon: <TrendingUp />,
    },
    {
      total: "$68",
      label: "Avg. Order Value(AOV)",
      badgeLabel: "0.39",
      badgeColor: "destructive",
      text: "Weekly trend",
      number: ".50",
      icon: <TrendingDown />,
    },
    {
      total: "$2,345",
      label: "Account Balance",
      badgeLabel: "104",
      badgeColor: "success",
      text: "Daily trend",
      number: ".94",
      icon: <TrendingUp />,
    },
  ];

  return (
    <Card className="bg-accent/70 mb-5 rounded-md p-1">
      <CardContent className="bg-background border-border rounded-md border p-0">
        <div className="grid md:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between gap-5 p-4.5 pb-3.5 md:border-b ${index > 0 ? "border-border md:border-s" : ""}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-xl font-semibold lg:text-2xl">
                  {item.total}
                  <span className="text-secondary-foreground/30 text-xl font-semibold lg:text-2xl">
                    {item.number}
                  </span>
                </span>
                <span className="text-secondary-foreground/70 text-xs font-normal">
                  {item.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant={item.badgeColor as any}
                  size="sm"
                  appearance="light"
                  className="w-fit"
                >
                  {item.icon} {item.badgeLabel}%
                </Badge>
                <span className="text-secondary-foreground text-xs font-normal">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
