import { Router, Gauge, Server, Tv } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";

export function ServiceOverview() {
  return (
    <Card>
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Router className="size-5 text-primary" /> Service Overview
        </CardTitle>
        <CardToolbar>
          <span className="text-xs font-medium text-muted-foreground">
            Last updated: 2 hrs ago
          </span>
        </CardToolbar>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-primary text-white rounded-lg">
              <Gauge className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">
                Main Subscription
              </p>
              <h4 className="text-xl font-bold mt-1">Fiber Home 100Mbps</h4>
              <p className="text-sm text-muted-foreground">
                Next billing cycle starts Nov 1st
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-foreground">
              $59.99<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <span className="text-xs text-emerald-600 font-bold block mt-1">
              Auto-renew active
            </span>
          </div>
        </div>

        <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          Active Add-ons
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Server className="size-6 text-muted-foreground" />
              <div>
                <p className="font-bold text-sm">Static IP Address</p>
                <p className="text-xs text-muted-foreground">Fixed IPv4 mapping</p>
              </div>
            </div>
            <p className="font-bold text-foreground">$5.00/mo</p>
          </div>
          <div className="p-4 rounded-xl border flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Tv className="size-6 text-muted-foreground" />
              <div>
                <p className="font-bold text-sm">Premium TV Pack</p>
                <p className="text-xs text-muted-foreground">150+ Channels (HD)</p>
              </div>
            </div>
            <p className="font-bold text-foreground">$15.00/mo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
