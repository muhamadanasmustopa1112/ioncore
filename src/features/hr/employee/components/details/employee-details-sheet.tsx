"use client";

import { useRouter } from "next/navigation";
import { Expand } from "lucide-react";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeStore } from "../../store/employee";
import { EmployeeActivity } from "./employee-activity";
import { EmployeeDetailsBilling } from "./employee-details-billing";
import { EmployeeDetailsInvoice } from "./employee-details-invoice";
import { EmployeeDetailsOrders } from "./employee-details-orders";
import { EmployeeDetailsOverviews } from "./employee-details-overview";
import { EmployeeDetailsReviews } from "./employee-details-review";
import { Upload } from "./employee-upload";

export function EmployeeDetailsSheet() {
  const router = useRouter();
  const {
    employeeDetailsSheetOpen,
    closeEmployeeDetailsSheet,
    selectedEmployee,
    openEmployeeFormSheet,
  } = useEmployeeStore();

  const onExpandClick = () => {
    closeEmployeeDetailsSheet();
    router.push("/human-resources/employee/detail/guid-employee");
  };

  const handleEditClick = () => {
    closeEmployeeDetailsSheet();
    openEmployeeFormSheet("edit");
  };

  return (
    <Sheet open={employeeDetailsSheetOpen} onOpenChange={closeEmployeeDetailsSheet}>
      <SheetContent className="inset-5 start-auto h-auto gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[1160px] [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-border border-b px-5 py-3.5">
          <SheetTitle className="font-medium">Customer Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="grow p-0">
          <div className="border-border flex flex-wrap justify-between gap-2 border-b px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-foreground leading-none font-semibold lg:text-[22px]">
                  {selectedEmployee?.fullname || "N/A"}
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  {selectedEmployee?.status || "Active"}
                </Badge>
              </div>
              <div className="text-2sm flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground font-normal">
                  Customer ID:
                </span>
                <span className="text-foreground font-medium">{selectedEmployee?.guid || "N/A"}</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="text-muted-foreground font-normal">
                  Joined
                </span>
                <span className="text-foreground font-medium">
                  {selectedEmployee?.job?.join_date || "N/A"}
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="text-muted-foreground font-normal">
                  Last Visit
                </span>
                <span className="text-foreground font-medium">2 days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost" onClick={closeEmployeeDetailsSheet}>
                Close
              </Button>
              <Button variant="outline">Send Email</Button>
              <Button variant="mono" onClick={handleEditClick}>
                Edit Details
              </Button>
              <Button variant="outline" onClick={onExpandClick}>
                <Expand />
              </Button>
            </div>
          </div>
          <ScrollArea
            className="mx-1.5 flex h-[calc(100dvh-15.8rem)] flex-col"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex grow flex-wrap px-3.5 lg:flex-nowrap">
              <div className="w-full shrink-0 space-y-4 py-5 lg:w-[280px] lg:pe-5">
                <Upload />
              </div>

              <div className="border-border grow space-y-5 py-5 lg:border-s lg:ps-5">
                <Tabs
                  defaultValue="overview"
                  className="text-muted-foreground w-auto text-sm"
                >
                  <TabsList className="mb-2.5 inline-flex w-auto grow-0">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="billin">Billing Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <EmployeeDetailsOverviews />
                  </TabsContent>
                  <TabsContent value="orders">
                    <EmployeeDetailsOrders />
                  </TabsContent>
                  <TabsContent value="invoices">
                    <EmployeeDetailsInvoice />
                  </TabsContent>
                  <TabsContent value="billin">
                    <EmployeeDetailsBilling />
                  </TabsContent>
                  <TabsContent value="reviews">
                    <EmployeeDetailsReviews />
                  </TabsContent>
                  <TabsContent value="activity">
                    <EmployeeActivity />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0">
          <Button variant="ghost" onClick={closeEmployeeDetailsSheet}>
            Close
          </Button>
          <Button variant="outline">Send Email</Button>
          <Button variant="mono" onClick={handleEditClick}>
            Edit Details
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
