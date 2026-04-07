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
const latestCustomers = [
  { id: "#C-8291", name: "Sarah Jenkins", plan: "Enterprise", planVariant: "primary" as const, date: "Oct 24, 2023", customerId: "C-8291" },
  { id: "#C-8290", name: "Mark Thompson", plan: "Pro", planVariant: "secondary" as const, date: "Oct 23, 2023", customerId: "C-8290" },
  { id: "#C-8289", name: "Global Tech LLC", plan: "Enterprise", planVariant: "primary" as const, date: "Oct 22, 2023", customerId: "C-8289" },
];
export function CrmCustomersTable() {
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
              <TableHead>Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestCustomers.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Badge variant={row.planVariant} appearance="light" size="md">
                    {row.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" mode="link" size="sm" asChild>
                    <Link href={`/crm-and-sales/${row.customerId}`}>Detail</Link>
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
