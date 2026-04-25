"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkOrderList } from "@/features/operations/work-orders/api/work-order-queries";
import type { WoStatus } from "@/features/operations/work-orders/types/work-order-api";
import { paths } from "@/config/paths";

const STATUS_VARIANT: Record<
  WoStatus,
  "secondary" | "warning" | "success"
> = {
  CREATED: "secondary",
  IN_PROGRESS: "warning",
  DONE: "success",
};

const STATUS_LABEL: Record<WoStatus, string> = {
  CREATED: "Created",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function CrmWorkOrdersTable() {
  const { data, isLoading, isError } = useWorkOrderList({ per_page: 5 });

  const workOrders = data?.workOrders ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ongoing Work Orders</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link" asChild>
            <Link href={paths.dashboard.operations.workOrders.root.getHref()}>
              View All
            </Link>
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-destructive">
                  Failed to load work orders
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && workOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  No work orders found
                </TableCell>
              </TableRow>
            )}
            {workOrders.slice(0, 5).map((wo) => (
              <TableRow key={wo.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {wo.id.slice(0, 8)}…
                </TableCell>
                <TableCell className="font-medium truncate max-w-[180px]">
                  {wo.title ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground capitalize text-xs">
                  {wo.type?.replace(/_/g, " ").toLowerCase() ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[wo.status]} appearance="light" size="md">
                    {STATUS_LABEL[wo.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" mode="link" size="sm" asChild>
                    <Link href={paths.dashboard.operations.workOrders.root.getHref()}>
                      Detail
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </Card>
  );
}
