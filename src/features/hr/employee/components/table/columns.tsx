import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Employee } from "../../types";
import { ActionsCell } from "./data-table-actions-cell";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "id",
    accessorKey: "id",
    accessorFn: (row) => row.guid,
    header: ({ column }) => <DataGridColumnHeader title="ID" column={column} />,
    cell: () => <></>,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 51,
    meta: {
      cellClassName: "",
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
        <img
          src={row.original.url_profile_picture}
          className="rounded-full size-7 shrink-0"
          alt={`${row.original.fullname}`}
        />
        <div className="flex flex-col">
          <Link
            href="#"
            className="text-sm font-medium text-mono hover:text-primary-active mb-px"
          >
            {row.original.fullname}
          </Link>
          <span className="text-sm text-secondary-foreground font-normal">
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
    },
  },
  // {
  //   id: 'total',
  //   accessorFn: (row) => row.total,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Earnings" column={column} />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="font-normal text-foreground">
  //       {row.original.total}
  //     </span>
  //   ),
  //   enableSorting: true,
  //   size: 150,
  //   meta: {
  //     headerClassName: '',
  //   },
  // },
  // {
  //   id: 'team',
  //   accessorFn: (row) => row.team,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Team" column={column} />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center text-foreground font-normal gap-1.5">
  //       <img
  //         src={toAbsoluteUrl(
  //           `/media/brand-logos/${row.original.team.logo}`,
  //         )}
  //         className="w-5 shrink-0"
  //         alt="image"
  //       />
  //       {row.original.team.label}
  //     </div>
  //   ),
  //   enableSorting: true,
  //   size: 175,
  //   meta: {
  //     headerClassName: '',
  //   },
  // },
  // {
  //   id: 'products',
  //   accessorFn: (row) => row.products,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Products" column={column} />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="font-normal text-foreground">
  //       {row.original.products}
  //     </span>
  //   ),
  //   enableSorting: true,
  //   size: 140,
  //   meta: {
  //     headerClassName: '',
  //   },
  // },
  // {
  //   id: 'rating',
  //   accessorFn: (row) => row.rating,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Rating" column={column} />
  //   ),
  //   cell: ({ row }) => (
  //     <Rating
  //       rating={row.original.rating.value}
  //       round={row.original.rating.round}
  //     />
  //   ),
  //   enableSorting: true,
  //   size: 150,
  //   meta: {
  //     headerClassName: '',
  //   },
  // },
  // {
  //   id: 'social',
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Social Profiles" column={column} />
  //   ),
  //   cell: () => (
  //     <div className="flex items-center gap-2.5">
  //       <Link href="#">
  //         <Facebook size={16} className="text-muted-foreground text-lg" />
  //       </Link>
  //       <Link href="#">
  //         <Dribbble size={16} className="text-muted-foreground text-lg" />
  //       </Link>
  //       <Link href="#">
  //         <Music2 size={16} className="text-muted-foreground text-lg" />
  //       </Link>
  //     </div>
  //   ),
  //   enableSorting: true,
  //   size: 150,
  //   meta: {
  //     headerClassName: '',
  //   },
  // },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row} />,
    enableSorting: false,
    size: 60,
    meta: {
      headerClassName: "",
    },
  },
];
