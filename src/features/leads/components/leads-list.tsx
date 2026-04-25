"use client";
import Link from "next/link";
import { useState } from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useAdminLeads } from "../api/leads-queries";
import type { LeadDto, LeadStatus } from "../types/leads-api";
import { RerouteLeadSheet } from "./reroute-lead-sheet";

const statusVariant: Record<LeadStatus, "primary" | "success" | "warning" | "destructive" | "secondary"> = {
  new: "secondary",
  active: "primary",
  warm: "warning",
  hot: "destructive",
  converted: "success",
  lost: "secondary",
  potential: "warning",
};

export function LeadsList() {
  const [search, setSearch] = useState("");
  const [rerouteLead, setRerouteLead] = useState<LeadDto | null>(null);
  const { data, isLoading } = useAdminLeads({ name: search || undefined });
  const leads = data?.leads ?? [];

  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardToolbar>
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60"
              />
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cable (m)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                )}
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.lead_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.lead_type} / {lead.customer_sub_type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[lead.status] ?? "secondary"} appearance="light" size="md">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.cable_distance_meters}
                      {lead.is_excess_cable_accepted ? " (excess ok)" : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" mode="link" size="sm">
                          <Link href={paths.dashboard.crmAndSales.leads.detail.getHref(lead.id)}>
                            Detail
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRerouteLead(lead)}
                          className="gap-1 text-xs"
                        >
                          <RiArrowRightUpLine className="size-3.5" />
                          Reroute
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardTable>
        </Card>
      </div>

      <RerouteLeadSheet
        lead={rerouteLead}
        open={!!rerouteLead}
        onClose={() => setRerouteLead(null)}
      />
    </>
  );
}
