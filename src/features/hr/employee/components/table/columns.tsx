import Link from "next/link";
import { RiFilePdf2Line } from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee } from "../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "id",
    accessorKey: "id",
    accessorFn: (row) => row.guid,
    header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
    cell: ({ row }) => (
      <div className="text-primary cursor-pointer">{row.original.guid}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    meta: {
      cellClassName: "",
      skeleton: <Skeleton className="w-[70px] h-5" />,
    },
  },
  {
    id: "fullname",
    accessorFn: (row) => row.fullname,
    header: ({ column }) => (
      <DataGridColumnHeader title="Fullname" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar>
          <AvatarImage src={row.original.url_profile_picture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link
            href="#"
            className="text-sm font-bold text-mono hover:text-primary-active mb-px"
          >
            {row.original.fullname}
          </Link>
          <span className="text-sm text-muted-foreground font-normal">
            {row.original.job?.job_name}
          </span>
        </div>
      </div>
    ),
    enableSorting: true,
    size: 260,
    meta: {
      headerTitle: "Full Name",
      headerClassName: "",
      skeleton: (
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-[90px] h-5" />
            <Skeleton className="w-[70px] h-5" />
          </div>
        </div>
      ),
    },
  },
  {
    id: "account_info",
    accessorFn: (row) => row.nickname,
    header: ({ column }) => (
      <DataGridColumnHeader title="Account Info" column={column} />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-bold">{row.original.nickname}</div>
        <div className="text-muted-foreground">{row.original.email}</div>
      </div>
    ),
    enableSorting: true,
    size: 150,
    meta: {
      headerTitle: "Account Info",
      headerClassName: "",
      skeleton: (
        <div className="flex flex-col gap-1">
          <Skeleton className="w-[90px] h-5" />
          <Skeleton className="w-[70px] h-5" />
        </div>
      ),
    },
  },
  {
    id: "outlet",
    accessorFn: (row) => row.outlet?.outlet_name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Outlet" column={column} />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-bold">{row.original.outlet?.outlet_name}</div>
        <div className="text-muted-foreground">
          {row.original.job?.join_date
            ? format(row.original.job?.join_date, "dd MMMM yyyy")
            : "-"}
        </div>
      </div>
    ),
    enableSorting: true,
    size: 150,
    meta: {
      headerClassName: "",
      skeleton: (
        <div className="flex flex-col gap-1">
          <Skeleton className="w-[90px] h-5" />
          <Skeleton className="w-[70px] h-5" />
        </div>
      ),
    },
  },
  {
    id: "cv",
    accessorFn: (row) => row.cv_file_url,
    header: ({ column }) => (
      <DataGridColumnHeader title="Outlet" column={column} />
    ),
    cell: ({ row }) => {
      if (row.original.cv_file_url) {
        return (
          <a
            href={row.original.cv_file_url}
            target="_blank"
            className="flex items-center justify-center"
          >
            <RiFilePdf2Line className="w-8 h-8 text-muted-foreground" />
          </a>
        );
      }
      return "";
    },
    enableSorting: true,
    size: 150,
    meta: {
      headerTitle: "CV",
      headerClassName: "",
      skeleton: <Skeleton className="w-[70px] h-5" />,
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 60,
    meta: {
      headerClassName: "",
      skeleton: <Skeleton className="w-[70px] h-5" />,
    },
  },
];
