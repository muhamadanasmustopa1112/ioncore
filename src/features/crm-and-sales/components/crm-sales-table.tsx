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
const salesDeals = [
  { id: "#S-402", customer: "Horizon Ventures", amount: "$12,500", date: "Oct 24, 2023" },
  { id: "#S-401", customer: "Apex Systems", amount: "$8,200", date: "Oct 23, 2023" },
  { id: "#S-400", customer: "Quantum Lab", amount: "$25,000", date: "Oct 22, 2023" },
];
export function CrmSalesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales Deals</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link">View All</Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesDeals.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell className="font-semibold">{row.amount}</TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" mode="link" size="sm">Detail</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </Card>
  );
}
