"use client";

import { useState } from "react";
import Link from "next/link";
import { Circle, CircleCheck, MapPin } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
// import type { OrderListData } from '../tables/order-list';
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

interface TrackShippingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>; // Generic data type for flexibility
}

export function EmployeeTrackShippingSheet({
  open,
  onOpenChange,
}: TrackShippingSheetProps) {
  const steps = [
    { title: "Picking" },
    { title: "Packed" },
    { title: "Shipping" },
    { title: "Delivered" },
  ];

  const [currentStep] = useState(2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-3.5 start-auto h-auto rounded-lg border p-0 sm:w-[720px] sm:max-w-none [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-border border-b px-5 py-3.5">
          <SheetTitle className="font-medium">Track Shipping</SheetTitle>
        </SheetHeader>
        <SheetBody className="p-0 lg:pt-2">
          <ScrollArea className="me-1 h-[calc(100dvh-11.75rem)] px-5">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-foreground font-semibold lg:text-[22px]">
                    SHP-3827462
                  </h3>
                  <Badge size="sm" variant="success" appearance="light">
                    Shipped
                  </Badge>
                </div>
                <div className="text-2sm flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground font-normal">
                    Placed
                  </span>
                  <span className="text-foreground/80 font-medium">
                    2022-01-01
                  </span>
                  <BadgeDot className="bg-muted-foreground/60 mx-1 size-1" />
                  <span className="text-muted-foreground font-normal">
                    Order ID
                  </span>
                  <Link
                    href="#"
                    className="text-foreground font-medium underline"
                  >
                    SO-AMS-4620
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="ghost">Cancel Order</Button>
                <Button variant="outline">Notify Customer</Button>
              </div>
            </div>

            {/* Shipping Status */}
            <Card className="mb-5 rounded-md">
              <CardContent className="p-0">
                <div className="bg-accent/50 flex flex-wrap items-start justify-between gap-5 p-5">
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

                <Stepper defaultValue={currentStep} className="w-full p-5 pt-3">
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
                                <StepperTitle
                                  className={`font-medium ${
                                    isCompleted || isActive
                                      ? "text-secondary-foreground/80 text-2sm"
                                      : "text-secondary-foreground text-2sm"
                                  }`}
                                >
                                  {step.title}
                                </StepperTitle>
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

            {/* Shipping Data */}
            <Card className="mb-5 rounded-md">
              <CardHeader className="bg-accent/50 min-h-[34px]">
                <CardTitle className="text-2sm">Shipping Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 sm:grid-cols-4">
                  {[
                    { label: "Total Time", value: "19 days, 7 hours" },
                    { label: "Dep. Time", value: "01 Aug, 2025 09:17" },
                    { label: "Exp. Arrival", value: "17 Apr, 2025 12:00" },
                    { label: "Tracking No.", value: "1Z999AA10123456784" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <span className="text-2sm text-muted-foreground font-normal">
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

            {/* Shipping Log */}
            <Card className="rounded-md">
              <CardHeader className="bg-accent/50 min-h-[34px]">
                <CardTitle className="text-2sm">Shipping Log</CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  {
                    order: "Order Placed",
                    date: "28 Jul, 2025 10:02",
                    description: "Shipment information received by seller",
                  },
                  {
                    order: "Picking",
                    date: "28 Jul, 2025 11:02",
                    description: "Items being picked from inventory",
                  },
                  {
                    order: "Packed",
                    date: "28 Jul, 2025 12:27",
                    description: "Shipment information received by seller",
                  },
                  {
                    order: "Shipped",
                    date: "28 Jul, 2025 14:27",
                    description: "Package handed off to carrier",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative mb-3.5 flex items-start gap-2"
                  >
                    <div className="mt-1 flex h-full flex-col items-center gap-2">
                      <BadgeDot className="bg-secondary-foreground z-1 size-1.5 shrink-0" />
                      {index < 3 && (
                        <Separator
                          className="bg-muted-foreground/30 absolute top-3.5 h-full w-0.5 rounded-t-full rounded-b-full"
                          orientation="vertical"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2sm text-foreground font-medium">
                          {item.order}
                        </span>
                        <span className="text-muted-foreground text-xs font-normal">
                          {item.date}
                        </span>
                      </div>

                      <span className="text-muted-foreground text-xs font-normal">
                        {item.description}
                      </span>

                      {index === 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <MapPin className="text-muted-foreground size-3.5" />
                          <span className="text-2xs text-muted-foreground font-normal">
                            Silicon Valley, CA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex items-center border-t px-5 py-4 not-only-of-type:justify-between">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
