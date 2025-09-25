"use client";

import { useParams } from "next/navigation";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEmployeeStore } from "../../store/employee";
import { EmployeeScrollContentTwoColumnsCard } from "./employee-scroll-content-two-columns-card";

export function EmployeeDetailsTwoColumnsCard() {
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
            <span className="font-normal text-muted-foreground">Joined</span>
            <span className="font-medium text-foreground">16 Jan, 2022</span>
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
      <EmployeeScrollContentTwoColumnsCard />
    </>
  );
}
