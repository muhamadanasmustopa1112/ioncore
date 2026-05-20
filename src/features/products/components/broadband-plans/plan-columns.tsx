"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye, Trash2, SendHorizonal, CheckCircle, XCircle, Globe, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { useCan } from "@/lib/permissions";
import type { BroadbandPlan, BroadbandCustomerType, BroadbandPlanStatus } from "../../types/products";

const customerTypeBadge: Record<BroadbandCustomerType, { label: string; className: string }> = {
  broadband: { label: "Broadband", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  business:  { label: "Business",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  both:      { label: "Both",      className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
};

const statusBadge: Record<BroadbandPlanStatus, { label: string; className: string }> = {
  draft:     { label: "Draft",     className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  in_review: { label: "In Review", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  rejected:  { label: "Rejected",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  approved:  { label: "Approved",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  published: { label: "Published", className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inactive:  { label: "Inactive",  className: "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
};

const idr = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

interface ActionsProps {
  row: BroadbandPlan;
  onEdit: (row: BroadbandPlan) => void;
  onDetail: (row: BroadbandPlan) => void;
  onDelete: (id: string) => void;
  onSubmitReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, notes?: string) => void;
  onVisibility: (id: string, status: "published" | "inactive") => void;
  onSave: (row: BroadbandPlan) => void;
}

function ActionsCell({ row, onEdit, onDetail, onDelete, onSubmitReview, onApprove, onReject, onVisibility, onSave }: ActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [rejectDetailOpen, setRejectDetailOpen] = useState(false);
  const [actionConfirm, setActionConfirm] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);
  const canApprove = useCan("product.approve");
  const status = row.status;

  const confirm = (title: string, description: string, onConfirm: () => void) =>
    setActionConfirm({ title, description, onConfirm });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button mode="icon" variant="ghost" size="sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDetail(row)}>
            <Eye className="size-4 mr-2" /> Detail
          </DropdownMenuItem>
          {status !== "in_review" && (
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="size-4 mr-2" /> Edit
            </DropdownMenuItem>
          )}
          {(status !== "in_review" || canApprove) && <DropdownMenuSeparator />}
          {status === "draft" && (
            <DropdownMenuItem onClick={() => confirm("Submit for Review?", `Submit "${row.name}" for review? It will move to In Review.`, () => onSubmitReview(row.id))}>
              <SendHorizonal className="size-4 mr-2" /> Submit for Review
            </DropdownMenuItem>
          )}
          {status === "rejected" && (
            <>
              <DropdownMenuItem onClick={() => setRejectDetailOpen(true)}>
                <Info className="size-4 mr-2" /> Reject Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirm("Back to Draft?", `Save "${row.name}" as draft?`, () => onSave(row))}>
                <SendHorizonal className="size-4 mr-2" /> Back to Draft
              </DropdownMenuItem>
            </>
          )}
          {status === "in_review" && canApprove && (
            <>
              <DropdownMenuItem onClick={() => confirm("Approve Plan?", `Approve "${row.name}"? Status will change to Approved.`, () => onApprove(row.id))}>
                <CheckCircle className="size-4 mr-2" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setRejectOpen(true)}>
                <XCircle className="size-4 mr-2" /> Reject
              </DropdownMenuItem>
            </>
          )}
          {status === "approved" && (
            <DropdownMenuItem onClick={() => confirm("Publish Plan?", `Publish "${row.name}"? It will be visible to customers.`, () => onVisibility(row.id, "published"))}>
              <Globe className="size-4 mr-2" /> Publish
            </DropdownMenuItem>
          )}
          {status === "published" && (
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => confirm("Deactivate Plan?", `Deactivate "${row.name}"? It will be hidden from customers.`, () => onVisibility(row.id, "inactive"))}>
              <EyeOff className="size-4 mr-2" /> Deactivate
            </DropdownMenuItem>
          )}
          {status === "inactive" && (
            <DropdownMenuItem onClick={() => confirm("Submit Draft?", `Save "${row.name}" as draft?`, () => onSave(row))}>
              <SendHorizonal className="size-4 mr-2" /> Submit Draft
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Broadband Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{row.name}&rdquo; will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(row.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectOpen} onOpenChange={(o) => { setRejectOpen(o); if (!o) setRejectNotes(""); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Plan?</AlertDialogTitle>
            <AlertDialogDescription>Optionally provide a reason for rejection.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason (optional)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            className="mx-6 w-auto"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onReject(row.id, rejectNotes || undefined); setRejectOpen(false); setRejectNotes(""); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDetailOpen} onOpenChange={setRejectDetailOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejection Detail</AlertDialogTitle>
            <AlertDialogDescription>
              {row.rejection_notes || "No rejection notes provided."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!actionConfirm} onOpenChange={(o) => !o && setActionConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionConfirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{actionConfirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { actionConfirm?.onConfirm(); setActionConfirm(null); }}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function getPlanColumns(
  onEdit: (row: BroadbandPlan) => void,
  onDetail: (row: BroadbandPlan) => void,
  onDelete: (id: string) => void,
  onSubmitReview: (id: string) => void,
  onApprove: (id: string) => void,
  onReject: (id: string, reason?: string) => void,
  onVisibility: (id: string, status: "published" | "inactive") => void,
  onSave: (row: BroadbandPlan) => void,
): ColumnDef<BroadbandPlan>[] {
  return [
    {
      id: "name",
      accessorFn: (r) => r.name,
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} className="font-semibold" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      size: 200,
    },
    {
      id: "speed",
      header: ({ column }) => <DataGridColumnHeader title="Speed" column={column} className="font-semibold" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          ↓ {row.original.speed_download_mbps} / ↑ {row.original.speed_upload_mbps} Mbps
        </span>
      ),
      size: 180,
    },
    {
      id: "price",
      accessorFn: (r) => r.price,
      header: ({ column }) => <DataGridColumnHeader title="Price / mo" column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.price)}</span>,
      size: 150,
    },
    {
      id: "one_time_charge",
      accessorFn: (r) => r.one_time_charge,
      header: ({ column }) => <DataGridColumnHeader title="OTC" column={column} className="font-semibold" />,
      cell: ({ row }) => <span>{idr(row.original.one_time_charge)}</span>,
      size: 150,
    },
    {
      id: "customer_type",
      accessorFn: (r) => r.customer_type,
      header: ({ column }) => <DataGridColumnHeader title="Customer Type" column={column} className="font-semibold" />,
      cell: ({ row }) => {
        const cfg = customerTypeBadge[row.original.customer_type] ?? customerTypeBadge.broadband;
        return <span className={cfg.className}>{cfg.label}</span>;
      },
      size: 130,
    },
    {
      id: "status",
      accessorFn: (r) => r.status,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} className="font-semibold" />,
      cell: ({ row }) => {
        const cfg = statusBadge[row.original.status] ?? statusBadge.draft;
        return <span className={cfg.className}>{cfg.label}</span>;
      },
      size: 110,
    },
    {
      id: "actions",
      header: () => <span className="font-semibold text-foreground text-sm">Actions</span>,
      cell: ({ row }) => <ActionsCell row={row.original} onEdit={onEdit} onDetail={onDetail} onDelete={onDelete} onSubmitReview={onSubmitReview} onApprove={onApprove} onReject={onReject} onVisibility={onVisibility} onSave={onSave} />,
      size: 75,
      enableSorting: false,
    },
  ];
}
