"use client";

import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dummyInvoiceRegister,
  dummyArAgingDetail,
  dummyFakturPajak,
  dummySuspensionList,
  dummyCommissionDetail,
  formatIDR,
} from "../data/dummy-report-data";

const statusVariant: Record<string, "primary" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  paid: "success",
  unpaid: "destructive",
  pending: "warning",
  active: "primary",
  suspended: "destructive",
  reactivated: "success",
  overdue: "warning",
};

export function ReportTables() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("billing.report.tables.title", "Report Details")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="invoice-register">
          <TabsList variant="line" className="mb-4">
            <TabsTrigger value="invoice-register">
              {t("billing.report.tables.invoiceRegister", "Invoice Register")}
            </TabsTrigger>
            <TabsTrigger value="ar-aging">
              {t("billing.report.tables.arAging", "AR Aging Detail")}
            </TabsTrigger>
            <TabsTrigger value="faktur-pajak">
              {t("billing.report.tables.fakturPajak", "Faktur Pajak")}
            </TabsTrigger>
            <TabsTrigger value="suspension-list">
              {t("billing.report.tables.suspensionList", "Suspension List")}
            </TabsTrigger>
            <TabsTrigger value="commission-detail">
              {t("billing.report.tables.commissionDetail", "Commission Detail")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoice-register">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.report.tables.invoiceNumber", "Invoice #")}</TableHead>
                    <TableHead>{t("billing.report.tables.customer", "Customer")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.amount", "Amount")}</TableHead>
                    <TableHead>{t("billing.report.tables.status", "Status")}</TableHead>
                    <TableHead>{t("billing.report.tables.date", "Date")}</TableHead>
                    <TableHead>{t("billing.report.tables.branch", "Branch")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyInvoiceRegister.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.invoiceNumber}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell className="text-right">{formatIDR(row.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>
                          {t(`billing.report.status.${row.status}`, row.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.branch}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="ar-aging">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.report.tables.customer", "Customer")}</TableHead>
                    <TableHead>{t("billing.report.tables.invoiceNumber", "Invoice #")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.amount", "Amount")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.daysOverdue", "Days Overdue")}</TableHead>
                    <TableHead>{t("billing.report.tables.bucket", "Bucket")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyArAgingDetail.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.customerName}</TableCell>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell className="text-right">{formatIDR(row.amount)}</TableCell>
                      <TableCell className="text-right">{row.daysOverdue}</TableCell>
                      <TableCell>
                        <Badge variant={row.daysOverdue > 30 ? "destructive" : "secondary"}>
                          {row.bucket}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="faktur-pajak">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.report.tables.fpNumber", "FP Number")}</TableHead>
                    <TableHead>{t("billing.report.tables.invoiceNumber", "Invoice #")}</TableHead>
                    <TableHead>{t("billing.report.tables.customer", "Customer")}</TableHead>
                    <TableHead>{t("billing.report.tables.npwp", "NPWP")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.dpp", "DPP")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.ppn", "PPN")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.total", "Total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyFakturPajak.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.fpNumber}</TableCell>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell className="font-mono text-xs">{row.npwp}</TableCell>
                      <TableCell className="text-right">{formatIDR(row.dpp)}</TableCell>
                      <TableCell className="text-right">{formatIDR(row.ppn)}</TableCell>
                      <TableCell className="text-right font-medium">{formatIDR(row.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="suspension-list">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.report.tables.customer", "Customer")}</TableHead>
                    <TableHead>{t("billing.report.tables.status", "Status")}</TableHead>
                    <TableHead>{t("billing.report.tables.suspensionDate", "Suspension Date")}</TableHead>
                    <TableHead>{t("billing.report.tables.duration", "Duration")}</TableHead>
                    <TableHead>{t("billing.report.tables.branch", "Branch")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummySuspensionList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>
                          {t(`billing.report.status.${row.status}`, row.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.suspensionDate}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>{row.branch}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="commission-detail">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("billing.report.tables.salesRep", "Sales Rep")}</TableHead>
                    <TableHead>{t("billing.report.tables.customer", "Customer")}</TableHead>
                    <TableHead>{t("billing.report.tables.invoiceNumber", "Invoice #")}</TableHead>
                    <TableHead className="text-right">{t("billing.report.tables.amount", "Amount")}</TableHead>
                    <TableHead>{t("billing.report.tables.split", "Split")}</TableHead>
                    <TableHead>{t("billing.report.tables.status", "Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyCommissionDetail.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.salesRep}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.invoiceNumber}</TableCell>
                      <TableCell className="text-right">{formatIDR(row.amount)}</TableCell>
                      <TableCell className="font-mono text-xs">{row.split}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>
                          {t(`billing.report.status.${row.status}`, row.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
