import { History } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PaymentHistoryTable() {
  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" /> Payment History
        </CardTitle>
      </CardHeader>
      <CardContent className="py-10 text-center text-sm text-muted-foreground">
        Billing module not yet available.
      </CardContent>
    </Card>
  );
}
