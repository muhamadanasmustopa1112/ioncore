"use client";

import { useState } from "react";
import { RiCheckLine, RiDeleteBin7Line, RiEditLine, RiEyeLine, RiPlayLine, RiStopLine, RiAlarmWarningLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMaintenanceStore } from "../../../store/maintenance";
import { useUpdateMaintenanceStatus } from "../../../api/put-maintenance-status";
import type { MaintenanceEvent, MaintenanceStatus } from "../../../types";

export function ActionsCell({ row }: { row: Row<MaintenanceEvent> }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState<{ status: MaintenanceStatus; label: string } | null>(null);
  const { openFormSheet, setSelectedMaintenance } = useMaintenanceStore();
  const { mutate: updateStatus, isPending } = useUpdateMaintenanceStatus();

  const status = row.original.status;

  const handleApprove = () => setShowStatusDialog({ status: "scheduled", label: "Approve" });
  const handleStart = () => setShowStatusDialog({ status: "in_progress", label: "Start" });
  const handleComplete = () => setShowStatusDialog({ status: "completed", label: "Complete" });
  const handleEscalate = () => setShowStatusDialog({ status: "escalated_to_war_room", label: "Escalate" });

  const confirmStatus = () => {
    if (!showStatusDialog) return;
    updateStatus(
      { id: row.original.id, status: showStatusDialog.status },
      { onSuccess: () => setShowStatusDialog(null) },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost"><EllipsisVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          {status === "draft" && (
            <DropdownMenuItem className="cursor-pointer" onClick={handleApprove}>
              <RiCheckLine /> Approve
            </DropdownMenuItem>
          )}
          {status === "scheduled" && (
            <DropdownMenuItem className="cursor-pointer" onClick={handleStart}>
              <RiPlayLine /> Start Maintenance
            </DropdownMenuItem>
          )}
          {status === "in_progress" && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={handleComplete}>
                <RiStopLine /> Complete
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleEscalate}>
                <RiAlarmWarningLine /> Escalate to War Room
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedMaintenance(row.original); openFormSheet("edit"); }}>
            <RiEditLine /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedMaintenance(row.original); openFormSheet("details"); }}>
            <RiEyeLine /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <RiDeleteBin7Line /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{row.original.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowDeleteDialog(false)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!showStatusDialog} onOpenChange={() => setShowStatusDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {showStatusDialog?.label}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {showStatusDialog?.label?.toLowerCase()} &quot;{row.original.title}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatus} disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isPending ? "Processing..." : showStatusDialog?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
