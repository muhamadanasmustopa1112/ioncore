import { History, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTable,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const paymentHistory = [
  { date: "Sep 12, 2023", id: "#INV-88291", amount: "$79.99", status: "Paid", statusVariant: "success" as const },
  { date: "Aug 12, 2023", id: "#INV-87102", amount: "$79.99", status: "Paid", statusVariant: "success" as const },
  { date: "Jul 12, 2023", id: "#INV-86044", amount: "$79.99", status: "Paid", statusVariant: "success" as const },
];

export function PaymentHistoryTable() {
  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" /> Payment History
        </CardTitle>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell className="font-bold">{row.amount}</TableCell>
                <TableCell>
                  <Badge variant={row.statusVariant} appearance="light" size="sm">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" mode="icon" className="text-primary hover:bg-primary/10">
                    <Download className="size-4" />
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
