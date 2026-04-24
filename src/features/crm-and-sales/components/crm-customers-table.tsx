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
import { useCustomerList } from "@/features/customers/api/customers-queries";
import type { CustomerStatus } from "@/features/customers/types/customers-api";

const STATUS_VARIANT: Record<CustomerStatus, "success" | "warning" | "destructive" | "secondary" | "primary"> = {
  active: "success",
  pending: "warning",
  suspended: "destructive",
  deactivated: "secondary",
  churned: "secondary",
};

export function CrmCustomersTable() {
  const { data, isLoading, isError, error } = useCustomerList({
    order_by: "created_at",
    order_direction: "desc",
    size: 5,
  });

const customers = Array.isArray(data?.items) ? data.items : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Customers Activated</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link">View All</Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">Loading…</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive py-6">
                  {(error as Error)?.message ?? "Failed to load customers"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No customers found</TableCell>
              </TableRow>
            )}
            {customers.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-xs text-muted-foreground">
                  {row.id.slice(0, 8)}
                </TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[row.status]} appearance="light" size="md">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.activation_date
                    ? new Date(row.activation_date).toLocaleDateString()
                    : new Date(row.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" mode="link" size="sm" asChild>
                    <Link href={`/crm-and-sales/${row.id}`}>Detail</Link>
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
