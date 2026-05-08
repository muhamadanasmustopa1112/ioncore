"use client";

import * as React from "react";
import { Loader2, PlusCircle } from "lucide-react";
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
  onAddService?: () => void;
  onChangePlan?: () => void;
  onDeactivate?: () => void;
  isDeactivating?: boolean;
}

export function CustomerHeader({ customer, onAddService, onChangePlan, onDeactivate, isDeactivating }: Props) {
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

  const isInactive = status === "deactivated" || status === "churned";

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
        {!isInactive && (
          <>
            <Button variant="primary" onClick={onAddService}>
              <PlusCircle className="size-4" />
              Add Service
            </Button>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/5"
              onClick={onDeactivate}
              disabled={isDeactivating}
            >
              {isDeactivating && <Loader2 className="size-4 animate-spin" />}
              Deactivate Service
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
