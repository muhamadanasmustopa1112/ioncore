"use client";

import { useState } from "react";
import {
  RiChatCheckLine,
  RiUserAddLine,
  RiArrowUpLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
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
import type { Ticket } from "../../../types";

interface TicketActionsBarProps {
  ticket: Ticket;
}

export function TicketActionsBar({ ticket }: TicketActionsBarProps) {
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const isActive =
    ticket.status !== "closed" &&
    ticket.status !== "resolved";

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {isActive && (
          <>
            <Button variant="outline" size="sm" aria-label="Add note to ticket">
              <RiChatCheckLine className="size-4" />
              Add Note
            </Button>
            <Button variant="outline" size="sm" aria-label="Assign ticket">
              <RiUserAddLine className="size-4" />
              Assign
            </Button>
            <Button variant="outline" size="sm" aria-label="Escalate ticket">
              <RiArrowUpLine className="size-4" />
              Escalate
            </Button>
            <Button variant="outline" size="sm" aria-label="Mark ticket as resolved">
              <RiCheckboxCircleLine className="size-4" />
              Mark Resolved
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              aria-label="Close ticket"
              onClick={() => setShowCloseDialog(true)}
            >
              <RiCloseCircleLine className="size-4" />
              Close Ticket
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              This will close ticket {ticket.ticket_number}. A CSAT survey will
              be sent to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowCloseDialog(false)}>
              Close Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
