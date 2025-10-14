"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function EmployeeStatistic3({}: object) {
  const items = [
    {
      total: "Prime Plan",
      label: "Good for Startups & Individuals",
    },
    {
      total: "$144.00",
      label: "Annual Fee",
    },
    {
      total: "$12.00",
      label: "Next Bill Amount",
    },
    {
      total: "12 Dec, 25",
      label: "Next Bill Date",
    },
  ];

  return (
    <Card className="bg-accent/70 mb-5 rounded-md p-1">
      <CardContent className="bg-background border-border rounded-md border p-0">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${index === 0 ? "flex-2" : "flex-1"} flex flex-col gap-2 px-4.5 py-3 ${index > 0 ? "border-border sm:border-s" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-1">
                <span
                  className={`text-foreground font-semibold ${item.total === "Prime Plan" ? "text-xl leading-6" : "text-base leading-5"}`}
                >
                  {item.total}
                </span>
                {item.total === "Prime Plan" && (
                  <Badge variant="success" appearance="light" size="sm">
                    Monthly
                  </Badge>
                )}
              </div>
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
