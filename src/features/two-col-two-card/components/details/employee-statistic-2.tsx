"use client";

import { Card, CardContent } from "@/components/ui/card";

export function EmployeeStatistic2({}: object) {
  const items = [
    {
      total: "1,246",
      label: "Total Orders",
    },
    {
      total: "4",
      label: "In Progress",
    },
    {
      total: "1,246",
      label: "Delivered Orders",
    },
    {
      total: "95",
      label: "Returns",
    },
  ];

  return (
    <Card className="bg-accent/70 mb-5 rounded-md p-1">
      <CardContent className="bg-background border-border rounded-md border p-0">
        <div className="grid sm:grid-cols-4 lg:gap-5">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col px-4 py-3 ${index > 0 ? "border-border sm:border-s" : ""}`}
            >
              <span className="text-foreground text-2xl font-semibold">
                {item.total}
              </span>
              <span className="text-secondary-foreground/70 text-xs font-normal">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
