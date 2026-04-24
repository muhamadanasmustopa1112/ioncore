import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CustomerDetail } from "@/features/customers/types/customers-api";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  customer?: CustomerDetail;
}

export function CustomerHeader({ customer }: Props) {
  const name = customer?.full_name ?? "—";
  const display = customer?.company_name
    ? `${customer.full_name} (${customer.company_name})`
    : name;
  const status = customer?.status ?? "pending";
  const statusVariant =
    status === "active"
      ? "success"
      : status === "suspended"
        ? "warning"
        : status === "deactivated" || status === "churned"
          ? "destructive"
          : "secondary";

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex gap-6 items-center">
        <div className="rounded-xl overflow-hidden ring-4 ring-primary/5 shrink-0">
          <Avatar className="size-24 rounded-none">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{display}</h1>
            <Badge variant={statusVariant} appearance="light" size="md">
              {status}
            </Badge>
          </div>
          <p className="text-muted-foreground font-medium">
            ID: {customer?.id ?? "—"} · {customer?.customer_type ?? "—"}
          </p>
          {customer?.activation_date && (
            <p className="text-sm text-muted-foreground">
              Activated: {customer.activation_date}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">
          <PlusCircle className="size-4" /> Add Service
        </Button>
        <Button variant="secondary">Change Plan</Button>
        <Button
          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
          variant="outline"
        >
          Deactivate Service
        </Button>
      </div>
    </div>
  );
}
