"use client";

import { FileText, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerDetail } from "@/features/customers/types/customers-api";

const DOC_STATUS_VARIANT: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

interface Props {
  customer?: CustomerDetail;
}

export function CustomerWidgets({ customer }: Props) {
  const documents = customer?.documents ?? [];
  const workOrders = customer?.work_orders ?? [];

  return (
    <>
      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="size-4 text-primary" /> Customer Info
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 pt-0">
          {([
            { label: "Branch ID", value: customer?.branch_id },
            { label: "Account Mgr", value: customer?.account_manager_id },
            { label: "Type", value: customer?.customer_type },
            {
              label: "Activated",
              value: customer?.activation_date
                ? new Date(customer.activation_date).toLocaleDateString()
                : undefined,
            },
            {
              label: "Created",
              value: customer?.created_at
                ? new Date(customer.created_at).toLocaleDateString()
                : undefined,
            },
          ] as { label: string; value: string | undefined }[]).map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="font-medium text-right truncate max-w-[160px]">{value ?? "—"}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location */}
      {customer?.location && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-primary" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm pt-0 space-y-1">
            <p className="text-muted-foreground">{customer.location.address}</p>
            <p className="text-xs text-muted-foreground/60">
              {customer.location.latitude.toFixed(6)}, {customer.location.longitude.toFixed(6)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="size-4 text-primary" /> Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded</p>
          ) : (
            <div className="flex flex-col gap-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="capitalize truncate text-muted-foreground">
                    {doc.document_type.replace(/_/g, " ")}
                  </span>
                  <Badge
                    variant={DOC_STATUS_VARIANT[doc.status] ?? "secondary"}
                    appearance="light"
                    size="sm"
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Orders */}
      {workOrders.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Work Orders</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col divide-y text-sm">
              {workOrders.slice(0, 5).map((wo) => (
                <div
                  key={wo.id}
                  className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                >
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {wo.id.slice(0, 8)}…
                  </span>
                  <Badge variant="secondary" appearance="light" size="sm">
                    {wo.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
