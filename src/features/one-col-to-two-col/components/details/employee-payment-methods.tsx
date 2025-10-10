"use client";

import Link from "next/link";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const paymentMethods = [
  {
    logo: "visa",
    name: "Jason Tatum",
    details: "Ending 3604 • Expires on 12/2026",
    isPrimary: true,
  },
  {
    logo: "ideal",
    name: "Jason Tatum",
    details: "iDeal with ABN Ambro",
    isPrimary: false,
  },
  {
    logo: "paypal",
    name: "Jason Tatum",
    details: "jasont@keenthemes.studio",
    isPrimary: false,
  },
];

export function EmployeePaymentMethods() {
  return (
    <Card className="bg-accent/70 rounded-md shadow-none">
      <CardContent className="p-0">
        <h3 className="text-foreground py-2.5 ps-2 text-sm font-medium">
          Payment Methods
        </h3>
        <div className="bg-background border-input m-1 mt-0 rounded-md border px-3.5 py-1">
          {paymentMethods.map((method, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background border-border flex size-10 shrink-0 items-center justify-center rounded-md border">
                    <div className="bg-accent/70 flex size-[34px] items-center justify-center rounded-md">
                      <img
                        src={toAbsoluteUrl(
                          `/media/brand-logos/${method.logo}.svg`,
                        )}
                        alt="image"
                        className={
                          method.logo === "ideal" ? "size-6" : "size-7"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Link
                        href={"#"}
                        className="text-foreground hover:text-primary text-sm font-medium"
                      >
                        {method.name}
                      </Link>
                      {method.isPrimary && (
                        <Badge className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <span className="text-2sm text-secondary-foreground/70 font-normal">
                      {method.details}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              {index < paymentMethods.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
