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
const workOrders = [
  { id: "#WO-1052", customer: "Tech Dynamics", status: "In Progress", statusVariant: "info" as const, due: "Oct 28, 2023" },
  { id: "#WO-1051", customer: "Visionary Apps", status: "Pending Review", statusVariant: "warning" as const, due: "Oct 26, 2023" },
  { id: "#WO-1050", customer: "Core Logistics", status: "In Progress", statusVariant: "info" as const, due: "Oct 25, 2023" },
];
export function CrmWorkOrdersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ongoing Work Orders</CardTitle>
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
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>
                  <Badge variant={row.statusVariant} appearance="light" size="md">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.due}</TableCell>
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
