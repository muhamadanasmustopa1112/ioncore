"use client";

import { useParams } from "next/navigation";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEmployeeStore } from "../../store/employee";
import { EmployeeFormSheet } from "../form/employee-form-sheet";
import { EmployeeContent } from "./employee-content";
import { EmployeeScrollContent } from "./employee-scroll-content";

export function EmployeeDetails() {
  const params = useParams();
  const id = params.id as string;

  const {
    form,
    employeeSheetOpen,
    openEmployeeFormSheet,
    closeEmployeeFormSheet,
  } = useEmployeeStore();

  const onEditClick = () => {
    openEmployeeFormSheet("edit");
  };

  return (
    <>
      <Card className="mx-5 mt-3">
        <CardContent className="p-0">
          <div className="border-border flex flex-wrap justify-between gap-2 border-b px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-foreground leading-none font-semibold lg:text-[22px]">
                  Jeroen de Jong
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Active
                </Badge>
              </div>
              <div className="text-2sm flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground font-normal">
                  Customer ID:
                </span>
                <span className="text-foreground font-medium">583920-XT</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="text-muted-foreground font-normal">
                  Joined
                </span>
                <span className="text-foreground font-medium">
                  16 Jan, 2022
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="text-muted-foreground font-normal">
                  Last Visit
                </span>
                <span className="text-foreground font-medium">2 days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="outline">Send Email</Button>
              <Button variant="mono" onClick={onEditClick}>
                Edit Details
              </Button>
            </div>
          </div>

          <EmployeeContent />
        </CardContent>
      </Card>

      {/* Employee Form Sheet */}
      {/* <EmployeeFormSheet
        mode={form ?? "new"}
        open={employeeSheetOpen}
        onOpenChange={closeEmployeeFormSheet}
      /> */}
    </>
  );
}
