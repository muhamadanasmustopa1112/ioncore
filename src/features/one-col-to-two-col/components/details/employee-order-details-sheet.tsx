"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Circle, CircleCheck } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, InputWrapper } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperTrigger,
} from "@/components/ui/stepper";

// Interface for current stock data
interface CurrentStockData {
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
  };
  stock: number;
  rsvd: number;
  tlvl: number;
  delta: {
    label: string;
    variant: string;
  };
  sum: string;
  lastMoved: string;
  handler: string;
  trend: {
    label: string;
    variant: string;
  };
}

interface Item {
  logo: string;
  title: string;
  sku: string;
  color: string;
  weight: string;
}

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: CurrentStockData;
  onClose?: () => void; // Added onClose prop
  onTrackShipping?: () => void; // Optional callback for track shipping
}

export function EmployeeOrderDetailsSheet({
  open,
  onOpenChange,
  onTrackShipping,
}: OrderDetailsSheetProps) {
  const [currentStep] = useState(2);

  const steps = [
    { title: "Picking" },
    { title: "Packed" },
    { title: "Shipping" },
    { title: "Delivered" },
  ];

  const items: Item[] = [
    {
      logo: "15.png",
      title: "Nike Air Max 270 React SE",
      sku: "WM-8421",
      color: "Beige",
      weight: "1.2",
    },
    {
      logo: "9.png",
      title: "Wave Strike Dynamic Boost Sneaker",
      sku: "XR-0293",
      color: "Red",
      weight: "0.9",
    },
  ];

  const prices = {
    Subtotal: "$320.00",
    Shipping: "$10.00",
    Tax: "$20.00",
    Total: "$350.00",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-5 start-auto h-auto gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[1080px] [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-border border-b px-5 py-3.5">
          <SheetTitle className="font-medium">Order Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="grow p-0">
          <div className="border-border flex justify-between gap-2 border-b px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-foreground leading-none font-semibold lg:text-[22px]">
                  Order: SO-FL-5633
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Shipped
                </Badge>
              </div>
              <div className="text-2sm flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground font-normal">
                  Created
                </span>
                <span className="text-foreground/80 font-medium">
                  16 Jan, 2025
                </span>
                <BadgeDot className="bg-muted-foreground/60 mx-1 size-1" />
                <span className="text-muted-foreground font-normal">
                  Customer:
                </span>
                <span className="text-foreground/80 font-medium">
                  Jeroen de Jong
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost">Delete</Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (onTrackShipping) {
                    onTrackShipping();
                  }
                }}
              >
                Order Tracking
              </Button>
              <Button variant="mono">View Shipping Label</Button>
            </div>
          </div>
          <ScrollArea
            className="mx-1.5 flex h-[calc(100vh-15.8rem)] flex-col"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex grow flex-wrap px-3.5 lg:flex-nowrap">
              <div className="border-border grow space-y-5 pt-5 lg:border-e lg:pe-5">
                {/* Order Data */}
                <Card className="rounded-md">
                  <CardHeader className="bg-accent/50 min-h-[34px]">
                    <CardTitle className="text-2sm">Order Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-start gap-5 lg:gap-10">
                      {[
                        { label: "Items", value: "2 Items" },
                        { label: "Total Price", value: "$320.00" },
                        { label: "Shipping Priority", value: "High" },
                        { label: "Delivery Method", value: "Express Delivery" },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1.5">
                          <span className="text-2sm text-secondary-foreground font-normal">
                            {item.label}
                          </span>
                          <span className="text-2sm text-foreground font-medium">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team */}
                <Card className="rounded-md">
                  <CardHeader className="bg-accent/50 min-h-[34px]">
                    <CardTitle className="text-2sm">Team</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {items.map((item, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col p-0">
                          <div className="flex w-full flex-wrap items-center justify-between gap-3.5 sm:flex-nowrap">
                            <div className="flex gap-3.5 md:items-center">
                              <Card className="bg-accent/50 flex h-[50px] w-[60px] shrink-0 items-center justify-center rounded-md shadow-none">
                                <img
                                  src={toAbsoluteUrl(
                                    `/media/store/client/1200x1200/${item.logo}`,
                                  )}
                                  className="h-[50px]"
                                  alt="img"
                                />
                              </Card>

                              <div className="-mt-1 flex flex-col justify-center gap-1.5">
                                <Link
                                  href="#"
                                  className="hover:text-primary text-dark text-sm leading-5.5 font-medium"
                                >
                                  {item.title}
                                </Link>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-secondary-foreground text-xs font-normal">
                                    SKU:{" "}
                                    <span className="text-foreground text-xs font-medium">
                                      {item.sku}
                                    </span>
                                  </span>

                                  <BadgeDot className="bg-muted-foreground size-1 shrink-0" />

                                  <span className="text-secondary-foreground text-xs font-normal">
                                    Color
                                    <span className="text-secondary-foreground ms-1 text-xs font-medium">
                                      {item.color}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2.5 text-end">
                              <span className="text-dark text-xs font-medium">
                                Weight
                              </span>
                              <InputWrapper className="h-[28px] w-[66px]">
                                <Input
                                  type="text"
                                  defaultValue={`${item.weight}`}
                                  placeholder=""
                                />
                                <span className="text-2sm text-muted-foreground font-normal">
                                  kg
                                </span>
                              </InputWrapper>
                            </div>
                          </div>

                          {index !== items.length - 1 && (
                            <Separator className="my-3.5" />
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </CardContent>
                </Card>

                {/* Shipping Status */}
                <Card className="rounded-md">
                  <CardContent className="p-0">
                    <div className="bg-accent/50 border-border flex flex-wrap items-start justify-between gap-5 border-b p-5">
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="text-2sm text-secondary-foreground leading-3 font-medium">
                            1234 Industrial Way, Dallas, TX 75201
                          </span>
                        </div>

                        <Separator
                          className="bg-muted-foreground/30 top-0 bottom-0 mt-px ml-[2px] min-h-3.5 w-0.5"
                          orientation="vertical"
                        />

                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="text-2sm text-secondary-foreground leading-3 font-medium">
                            8458 Sunset Blvd #209, Los Angeles, CA 90069
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" className="shrink-0">
                        <img
                          src={toAbsoluteUrl("/media/brand-logos/ups.svg")}
                          alt="UPS"
                          className="h-4 w-4"
                        />{" "}
                        UPS Global
                      </Button>
                    </div>

                    <Stepper
                      defaultValue={currentStep}
                      className="w-full p-5 pt-3"
                    >
                      <StepperNav className="flex w-full flex-wrap gap-2">
                        {steps.map((step, index) => {
                          const stepNumber = index + 1;
                          const isCompleted = stepNumber < currentStep;
                          const isActive = stepNumber === currentStep;

                          return (
                            <StepperItem
                              key={index}
                              step={stepNumber}
                              className="relative flex flex-1 items-center"
                            >
                              <StepperTrigger className="flex w-full flex-col items-center">
                                <div className="bg-border relative mt-2 h-1.5 w-full rounded-full">
                                  {index === steps.length - 2 ? (
                                    <div className="absolute top-0 left-0 mb-5 h-full w-1/2 rounded-l-full bg-green-500" />
                                  ) : index < steps.length - 2 ? (
                                    <div className="absolute top-0 left-0 h-full w-full rounded-full bg-green-500" />
                                  ) : null}
                                </div>

                                {/* Ikonka */}
                                <div className="-ms-1 flex w-full items-center gap-0.5">
                                  <div className="flex items-center gap-1">
                                    {index === steps.length - 2 ? (
                                      <CircleCheck
                                        className="border-background border-2 text-green-500"
                                        size={18}
                                      />
                                    ) : index < steps.length - 2 ? (
                                      <CircleCheck
                                        className="text-background fill-green-500"
                                        size={18}
                                      />
                                    ) : isActive ? (
                                      <CircleCheck
                                        className="text-background fill-green-500"
                                        size={18}
                                      />
                                    ) : (
                                      <Circle
                                        className="text-muted-foreground border-background border-2"
                                        size={18}
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-medium ${
                                        isCompleted || isActive
                                          ? "text-secondary-foreground/80 text-2sm"
                                          : "text-secondary-foreground text-2sm"
                                      }`}
                                    >
                                      {step.title}
                                    </span>
                                  </div>
                                </div>
                              </StepperTrigger>
                            </StepperItem>
                          );
                        })}
                      </StepperNav>
                    </Stepper>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full shrink-0 py-5 lg:w-[320px] lg:ps-5">
                <Card className="rounded-md">
                  <CardHeader className="bg-accent/50 min-h-[34px]">
                    <CardTitle className="text-2sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <span className="text-foreground text-sm font-medium">
                        Shipping to Jeroen's Home
                      </span>
                      <span className="text-2sm text-secondary-foreground font-normal">
                        Prinsengracht 24
                      </span>
                      <span className="text-2sm text-secondary-foreground font-normal">
                        1015 DV Amsterdam, NL
                      </span>
                    </div>

                    <Separator className="mt-4.5 mb-4" />

                    <div className="flex flex-col gap-2">
                      <span className="text-foreground text-sm font-medium">
                        Price Details
                      </span>
                      {Object.entries(prices).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-2sm text-secondary-foreground font-normal">
                            {key}
                          </span>
                          <span className="text-2sm text-foreground font-medium">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground text-sm font-normal">
                        Total
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        $22.99
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex items-center gap-2 border-t px-5 py-5 not-only-of-type:justify-between">
          <div className="text-secondary-foreground text-xs font-medium">
            Read Shipping
            <Link
              href="#"
              className="hover:text-primary text-primary ms-1 text-xs font-medium"
            >
              Terms & Conditions
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost">Delete</Button>
            <Button
              variant="outline"
              onClick={() => {
                if (onTrackShipping) {
                  onTrackShipping();
                }
              }}
            >
              Order Tracking
            </Button>
            <Button variant="mono">View Shipping Label</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
