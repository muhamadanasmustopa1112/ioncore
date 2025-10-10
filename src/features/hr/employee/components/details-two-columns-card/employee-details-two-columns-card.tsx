"use client";

import { useParams } from "next/navigation";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEmployeeStore } from "../../store/employee";
import { EmployeeScrollContentTwoColumnsCard } from "./employee-scroll-content-two-columns-card";

export function EmployeeDetailsTwoColumnsCard() {
  const params = useParams();
  const id = params.id as string;

  const { openEmployeeFormSheet } = useEmployeeStore();

  const onEditClick = () => {
    openEmployeeFormSheet("edit");
  };

  return (
    <>
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
            <span className="text-muted-foreground font-normal">Joined</span>
            <span className="text-foreground font-medium">16 Jan, 2022</span>
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
      <EmployeeScrollContentTwoColumnsCard />
    </>
  );
}
