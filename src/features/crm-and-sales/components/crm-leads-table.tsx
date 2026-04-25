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
import { useAdminLeads } from "@/features/leads/api/leads-queries";
import type { LeadStatus } from "@/features/leads/types/leads-api";
import { paths } from "@/config/paths";

const STATUS_VARIANT: Record<
  LeadStatus,
  "success" | "warning" | "destructive" | "secondary" | "primary"
> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "success",
  converted: "success",
  lost: "destructive",
  potential: "secondary",
};

export function CrmLeadsTable() {
  const { data, isLoading, isError } = useAdminLeads({
    sort_by: "created_at",
    sort_dir: "desc",
  });

  const leads = data?.leads ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Potential Leads</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link" asChild>
            <Link href={paths.dashboard.crmAndSales.leads.root.getHref()}>
              View All
            </Link>
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
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
                  Failed to load leads
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  No leads found
                </TableCell>
              </TableRow>
            )}
            {leads.slice(0, 5).map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.lead_name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{lead.source}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[lead.status]} appearance="light" size="md">
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {lead.lead_type}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" mode="link" size="sm" asChild>
                    <Link href={paths.dashboard.crmAndSales.leads.detail.getHref(lead.id)}>
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
