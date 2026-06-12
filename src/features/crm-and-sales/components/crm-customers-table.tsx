"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
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
import { paths } from "@/config/paths";
import { useCustomerList, useCustomerListByBranches } from "@/features/customers/api/customers-queries";
import type { CustomerStatus } from "@/features/customers/types/customers-api";
import { useBranchScope } from "@/hooks/use-branch-scope";

const STATUS_VARIANT: Record<CustomerStatus, "success" | "warning" | "destructive" | "secondary" | "primary"> = {
  active: "success",
  pending: "warning",
  suspended: "destructive",
  deactivated: "secondary",
  churned: "secondary",
};

export function CrmCustomersTable() {
  const { t } = useTranslation();
  const { isBranchScoped, scopedBranchIds } = useBranchScope("customer");

  const listParams = {
    order_by: "created_at" as const,
    order_direction: "desc" as const,
    size: 5,
    page: 1,
  };

  const { data: defaultData, isLoading: isDefaultLoading, isError: isDefaultError, error: defaultError } =
    useCustomerList(listParams, !isBranchScoped);

  const { data: scopedData, isLoading: isScopedLoading } = useCustomerListByBranches(
    scopedBranchIds,
    listParams,
    isBranchScoped,
  );

  const data = isBranchScoped ? scopedData : defaultData;
  const isLoading = isBranchScoped ? isScopedLoading : isDefaultLoading;
  const isError = isBranchScoped ? false : isDefaultError;
  const error = isBranchScoped ? undefined : defaultError;

  const customers = Array.isArray(data?.items) ? data.items : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("common.latestCustomersActivated")}</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link" asChild>
            <Link href={paths.dashboard.crmAndSales.customer.root.getHref()}>
              {t("common.viewAll")}
            </Link>
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.id")}</TableHead>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead>{t("common.date")}</TableHead>
              <TableHead>{t("common.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">{t("common.loading")}</TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive py-6">
                  {(error as Error)?.message ?? t("common.error")}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">{t("common.noData")}</TableCell>
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
