"use client";

import { useParams, useRouter } from "next/navigation";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEmployeeStore } from "../../store/employee";
import { EmployeeFormSheet } from "../form/employee-form-sheet";
import { EmployeeScrollContent } from "./employee-scroll-content";
import { paths } from "@/config/paths";

export function EmployeeDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    form,
    employeeSheetOpen,
    closeEmployeeFormSheet,
  } = useEmployeeStore();

  const onEditClick = () => {
    router.push(paths.dashboard.oneColNewPage.update.getHref(id || ""));
  };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="flex justify-between flex-wrap gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Jeroen de Jong
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Active
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 text-2sm">
                <span className="font-normal text-muted-foreground">
                  Customer ID:
                </span>
                <span className="font-medium text-foreground">583920-XT</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Joined
                </span>
                <span className="font-medium text-foreground">
                  16 Jan, 2022
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Last Visit
                </span>
                <span className="font-medium text-foreground">2 days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="outline">Send Email</Button>
              <Button variant="mono" onClick={onEditClick}>
                Edit Details
              </Button>
            </div>
          </div>
          {!!id && <EmployeeScrollContent />}
          {!id && (
            <ScrollArea
              className="flex flex-col h-[calc(100dvh-15.8rem)] mx-1.5"
              viewportClassName="[&>div]:h-full [&>div>div]:h-full"
            >
              <EmployeeScrollContent />
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Employee Form Sheet */}
      <EmployeeFormSheet
        mode={form ?? "new"}
        open={employeeSheetOpen}
        onOpenChange={closeEmployeeFormSheet}
      />
    </>
  );
}
