"use client";

import Link from "next/link";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EmployeeRecentOrder() {
  const orders = [
    {
      id: "ORD-001",
      product: "Air Max 270 React Eng...",
      tooltip: "Air Max 270 React Engineered",
      sku: "WM-8421",
      image: "1.png",
    },
    {
      id: "ORD-002",
      product: "Trail Runner Z2",
      sku: "UC-3990",
      image: "2.png",
      amount: "$125.00",
    },
    {
      id: "ORD-003",
      product: "Urban Flex Knit Low...",
      tooltip: "Urban Flex Knit Low Top Shoes",
      sku: "KB-8820",
      image: "3.png",
    },
  ];

  return (
    <TooltipProvider>
      <Card className="bg-accent/70 rounded-md shadow-none">
        <CardContent className="flex h-full flex-col p-0">
          <h3 className="text-foreground py-2.5 ps-2 text-sm font-medium">
            Recent Orders
          </h3>
          <div className="bg-background border-input m-1 mt-0 flex h-full flex-col justify-between rounded-md border px-3.5 py-5">
            <div className="mb-6 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-background border-border flex size-[36px] shrink-0 items-center justify-center rounded-md border">
                    <div className="bg-accent/50 flex size-[30px] items-center justify-center rounded-md">
                      <ShoppingCart className="h-5 w-5 fill-indigo-600 text-indigo-600" />
                    </div>
                  </div>
                  <span className="text-2xl leading-[22px] font-semibold">
                    $472
                    <span className="text-secondary-foreground/30 text-2xl font-semibold">
                      .59
                    </span>
                  </span>
                </div>
                <Badge variant="success" size="sm" appearance="light">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  14.73%
                </Badge>
                <span className="text-secondary-foreground/70 text-xs font-normal">
                  vs AOV
                </span>
              </div>

              {/*Progress Bars*/}
              <div className="flex items-center gap-1">
                <div className="flex flex-1 flex-col gap-3">
                  <Progress className="bg-secondary-foreground/30 h-1.5 w-full rounded-sm" />
                  <span className="text-2sm text-foreground font-medium">
                    $259.03
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Progress className="bg-secondary-foreground/18 h-1.5 w-[120px] rounded-sm" />
                  <span className="text-2sm text-foreground font-medium">
                    $125.00
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Progress className="bg-secondary-foreground/10 h-1.5 w-[76px] rounded-sm" />
                  <span className="text-2sm text-foreground font-medium">
                    $72.56
                  </span>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div>
              {orders.map((order, index) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Card className="bg-accent/50 flex h-[40px] w-[50px] shrink-0 items-center justify-center rounded-md shadow-none">
                        <img
                          src={toAbsoluteUrl(
                            `/media/store/client/1200x1200/${order.image}`,
                          )}
                          className="h-[40px] cursor-pointer"
                          alt="image"
                        />
                      </Card>

                      <div className="flex flex-col gap-1">
                        {order.product.includes("…") ||
                        order.product.includes("...") ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href="#"
                                onClick={() => {}}
                                className="text-foreground hover:text-primary text-left text-sm leading-3.5 font-medium"
                              >
                                {order.product}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {order.tooltip ||
                                  order.product.replace(/[….]/g, "")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            href="#"
                            className="text-foreground hover:text-primary text-left text-sm leading-3.5 font-medium"
                          >
                            {order.product}
                          </Link>
                        )}

                        <span className="inline-flex items-center gap-0.5">
                          <span className="text-muted-foreground text-xs uppercase">
                            SKU:
                          </span>{" "}
                          <span className="text-secondary-foreground text-xs font-medium">
                            {order.sku}
                          </span>
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View item
                    </Button>
                  </div>
                  {index < orders.length - 1 && (
                    <Separator className="my-3.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
