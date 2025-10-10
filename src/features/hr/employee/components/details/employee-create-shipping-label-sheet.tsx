"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputWrapper } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Item {
  logo: string;
  title: string;
  sku: string;
  color: string;
  weight: string;
}

interface Prices {
  [key: string]: string;
}

interface CreateShippingLabelSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>; // Generic data type for flexibility
}

export function EmployeeCreateShippingLabelSheet({
  open,
  onOpenChange,
}: CreateShippingLabelSheetProps) {
  const prices: Prices = {
    Subtotal: "$19.00",
    Discount: "$00.00",
    Total: "$3.99",
  };

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

  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);
  const [sendShippingInfo, setSendShippingInfo] = useState<boolean>(false);
  const [savePackage, setSavePackage] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleReset = () => {
    setDate(undefined);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-5 start-auto h-auto gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[940px] [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-border border-b px-5 py-3.5">
          <SheetTitle className="flex items-center gap-2.5">
            Create Shipping Label
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="grow p-0 px-1.5">
          <ScrollArea
            className="flex h-[calc(100dvh-10.6rem)] flex-col"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex grow flex-wrap px-3.5 lg:flex-nowrap">
              <div className="border-border grow space-y-5 py-5 lg:border-e lg:pe-5">
                {/* Order Details */}
                <Card className="rounded-md">
                  <CardContent className="p-0">
                    <div className="bg-accent/50 border-border flex flex-wrap items-start justify-between gap-5 border-b p-5">
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="text-secondary-foreground text-xs leading-3 font-medium">
                            1234 Industrial Way, Dallas, TX 75201
                          </span>
                        </div>

                        <Separator
                          className="bg-muted-foreground/30 top-0 bottom-0 mt-px ml-[2px] min-h-3.5 w-0.5"
                          orientation="vertical"
                        />

                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="text-secondary-foreground text-xs leading-3 font-medium">
                            8458 Sunset Blvd #209, Los Angeles, CA 90069
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5 p-5 sm:grid-cols-4">
                      {[
                        { label: "Order ID", value: "SO-AMS-4620" },
                        { label: "Placed", value: "28 Jul, 2025" },
                        { label: "Total Price", value: "$320.00" },
                        { label: "Shipping Priority", value: "High" },
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
                        <CardContent className="flex flex-col p-0">
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
                        </CardContent>
                      </React.Fragment>
                    ))}
                  </CardContent>
                </Card>

                {/* Packaging */}
                <Card className="rounded-md">
                  <Tabs defaultValue="custom" className="w-full">
                    <CardHeader className="bg-accent/50 min-h-[40px]">
                      <CardTitle className="text-sm">Packaging</CardTitle>
                      <TabsList
                        size="xs"
                        className="flex gap-3.5 border-none"
                        variant="line"
                      >
                        <TabsTrigger
                          value="custom"
                          className="data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground -mb-1.5 flex-1 border-b-[1px] pb-3 hover:text-inherit"
                        >
                          Custom Package
                        </TabsTrigger>
                        <TabsTrigger
                          value="carrier"
                          className="data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground -mb-1.5 flex-1 gap-3 border-b-[1px] pb-3 hover:text-inherit"
                        >
                          Carrier Package
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>

                    <CardContent className="pt-1.5">
                      <TabsContent value="custom" className="space-y-4">
                        <div className="flex flex-col gap-2.5">
                          <Label className="text-xs">Package Name</Label>
                          <Input defaultValue="Mike Anderson – Medium Box|" />
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:gap-5">
                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Package Type</Label>
                            <Select
                              defaultValue="medium-box"
                              indicatorPosition="right"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Medium Box" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-box">
                                  Small Box
                                </SelectItem>
                                <SelectItem value="medium-box">
                                  Medium Box
                                </SelectItem>
                                <SelectItem value="large-box">
                                  Large Box
                                </SelectItem>
                                <SelectItem value="xlarge-box">
                                  Extra Large Box
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Total Weight</Label>
                            <InputWrapper>
                              <Input type="email" placeholder="2.1" />
                              <span className="text-2sm text-muted-foreground font-normal">
                                kg
                              </span>
                            </InputWrapper>
                          </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 lg:gap-5">
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Length</Label>
                            <Input type="email" placeholder="48" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Width</Label>
                            <Input type="email" placeholder="36" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Height</Label>
                            <Input type="email" placeholder="20" />
                          </div>

                          <div className="flex flex-col gap-2.5 lg:basis-1/4">
                            <Label className="text-xs text-transparent">
                              Height
                            </Label>
                            <Select defaultValue="sm" indicatorPosition="right">
                              <SelectTrigger>
                                <SelectValue placeholder="cm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sm">sm</SelectItem>
                                <SelectItem value="mm">mm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={savePackage}
                            onCheckedChange={(value) => {
                              console.log(
                                "Save package checkbox value:",
                                value,
                              );
                              setSavePackage(value === true);
                            }}
                            size="sm"
                          />
                          <Label>Save package for future orders</Label>
                        </div>
                      </TabsContent>

                      <TabsContent value="carrier" className="space-y-4">
                        <div className="flex flex-col gap-2.5">
                          <Label className="text-xs">Package Name</Label>
                          <Input defaultValue="Mike Anderson – Medium Box|" />
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 lg:gap-5">
                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Package Type</Label>
                            <Select
                              defaultValue="large-box"
                              indicatorPosition="right"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Large Box" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-box">
                                  Small Box
                                </SelectItem>
                                <SelectItem value="medium-box">
                                  Medium Box
                                </SelectItem>
                                <SelectItem value="large-box">
                                  Large Box
                                </SelectItem>
                                <SelectItem value="xlarge-box">
                                  Extra Large Box
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Total Weight</Label>
                            <InputWrapper>
                              <Input type="email" placeholder="1.4" />
                              <span className="text-2sm text-muted-foreground font-normal">
                                kg
                              </span>
                            </InputWrapper>
                          </div>
                        </div>

                        <div className="flex flex-row items-center gap-5">
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Length</Label>
                            <Input type="email" placeholder="34" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Width</Label>
                            <Input type="email" placeholder="26" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Height</Label>
                            <Input type="email" placeholder="23" />
                          </div>

                          <div className="flex basis-1/4 flex-col gap-2.5">
                            <Label className="text-xs text-transparent">
                              Height
                            </Label>
                            <Select defaultValue="mm" indicatorPosition="right">
                              <SelectTrigger>
                                <SelectValue placeholder="mm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sm">sm</SelectItem>
                                <SelectItem value="mm">mm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(value) => {
                              console.log("Checkbox value:", value);
                              setChecked(value === true);
                            }}
                            size="sm"
                          />
                          <Label>Save package for future </Label>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </div>

              {/* Summary */}
              <div className="w-full shrink-0 space-y-5 lg:mt-5 lg:w-[320px] lg:ps-5">
                <Card className="rounded-md">
                  <CardHeader className="bg-accent/50 min-h-[34px]">
                    <CardTitle className="text-2sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <span className="text-foreground text-sm font-medium">
                        Shipping to Jeroen’s Home
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

                <div className="mb-3.5 flex flex-col gap-2.5">
                  <Label className="text-xs">Shipping Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative w-full shrink-0">
                        {date && (
                          <Button
                            type="button"
                            variant="dim"
                            size="sm"
                            className="absolute -end-0 top-1/2 -translate-y-1/2"
                            onClick={handleReset}
                          >
                            <X />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          mode="input"
                          placeholder={!date}
                          className="w-full justify-between"
                        >
                          <span>{date ? format(date, "PPP") : "Active"}</span>
                          <CalendarIcon />
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-1.5">
                  <Checkbox
                    size="sm"
                    checked={sendShippingInfo}
                    onCheckedChange={(value) => {
                      console.log("Send shipping info checkbox value:", value);
                      setSendShippingInfo(value === true);
                    }}
                  />
                  <div className="text-secondary-foreground text-xs font-medium">
                    Send
                    <Link
                      href="#"
                      className="hover:text-primary text-primary mx-1 text-xs font-medium"
                    >
                      Shipping Info
                    </Link>
                    to Customer
                  </div>
                </div>
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
            <Button variant="outline">Cancel</Button>
            <Button variant="mono">Buy Shipping Label</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
