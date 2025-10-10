"use client";

import { Card, CardContent } from "@/components/ui/card";

export function EmployeeBillingDetail() {
  const item = [
    {
      label: "Company Name",
      info: "KeenThemes",
    },
    {
      label: "Address",
      info: "Keizersgracht 136, 1015 CW Amsterdam, Netherlands",
    },
    {
      label: "Contact",
      info: "Jason Tatum",
    },
    {
      label: "VAT ID",
      info: "NL123456789B01",
    },
  ];

  return (
    <Card className="bg-accent/70 flex h-full flex-col rounded-md shadow-none">
      <CardContent className="flex h-full flex-col p-0">
        <h3 className="text-foreground py-2.5 ps-2 text-sm font-medium">
          Billing Details
        </h3>
        <div className="bg-background border-input m-1 mt-0 h-full space-y-5 rounded-md border px-3.5 py-6">
          {item.map((item, index) => (
            <div key={index} className="flex gap-2 lg:gap-10">
              <span className="text-secondary-foreground/80 basis-1/4 text-xs leading-6 font-normal">
                {item.label}
              </span>
              <span className="text-2sm text-foreground basis-2/4 leading-6 font-normal">
                {item.info}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
