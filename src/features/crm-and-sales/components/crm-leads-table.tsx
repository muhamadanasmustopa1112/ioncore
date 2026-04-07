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
const potentialLeads = [
  { name: "David Miller", source: "LinkedIn", interest: "High", interestVariant: "success" as const, agent: "R. Simmons" },
  { name: "Nexus Corp", source: "Referral", interest: "Medium", interestVariant: "warning" as const, agent: "T. Hall" },
  { name: "Emily Clark", source: "Direct", interest: "High", interestVariant: "success" as const, agent: "A. Rivera" },
];
export function CrmLeadsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Potential Leads</CardTitle>
        <CardToolbar>
          <Button variant="ghost" mode="link">View All</Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {potentialLeads.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">{row.source}</TableCell>
                <TableCell>
                  <Badge variant={row.interestVariant} appearance="light" size="md">
                    {row.interest}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.agent}</TableCell>
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
