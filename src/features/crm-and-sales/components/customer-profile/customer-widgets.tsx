import * as React from "react";
import { Mail, Phone, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function CustomerHeader() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex gap-6 items-center">
        <div className="rounded-xl overflow-hidden ring-4 ring-primary/5 shrink-0">
          <Avatar className="size-24 rounded-none">
            <AvatarImage
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP81qMLglbk_qrGooW7ga7YNaCzZizJPnKzbyRhHjhUqj3-eBMB9qDV8ICGLnenWFVVfjsCMWhamarXaN_vjnsAEkG0Jih9FHn6xCSXrLvRF0f0Hl0znDOy6mVJG4Eaty7L55vuXwVn8cfwlj4UJJDpTcXdbC2gaocnPhGFQgcSSDqpiKEahZuID4LnbOGGFIFYJX940gkN98Qw62d20poiSJ2HbZrXf8XFoBEanQiLghHNa0KA5kBB3xAEvA34l9-kPX4VqcTeZX8"
              alt="Sarah Jenkins"
            />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Sarah Jenkins</h1>
            <Badge variant="success" appearance="light" size="md">Active</Badge>
          </div>
          <p className="text-muted-foreground font-medium">
            ID: ISP-992831 • Platinum Member
          </p>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="size-4" /> s.jenkins@email.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-4" /> +1 (555) 012-3456
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">
          <PlusCircle className="size-4" /> Add Service
        </Button>
        <Button variant="secondary">
          Change Plan
        </Button>
        <Button className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20" variant="outline">
          Deactivate Service
        </Button>
      </div>
    </div>
  );
}
import { Wallet, CreditCard, MessageSquare, PhoneCall } from "lucide-react";

export function CustomerWidgets() {
  return (
    <>
      {/* Upcoming Payment Widget */}
      <div className="bg-primary/95 dark:bg-primary-foreground/10 rounded-xl p-6 text-white dark:text-foreground shadow-xl shadow-primary/10 border border-primary/20">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70 dark:text-muted-foreground mb-4">
          Upcoming Payment
        </h4>
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-3xl font-black">$79.99</p>
            <p className="text-sm text-slate-400 mt-1">Due on Oct 12, 2023</p>
          </div>
          <Wallet className="size-10 text-primary opacity-50 mb-1" />
        </div>
        <Button className="w-full font-bold" variant="primary">
          <CreditCard className="size-4 me-2" /> Pay Now
        </Button>
      </div>
      {/* Trouble Tickets Widget */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h4 className="font-bold text-sm">Trouble Tickets</h4>
          <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
            View All
          </span>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="p-3 bg-muted/50 rounded-lg flex flex-col gap-1 border-l-4 border-amber-500">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-muted-foreground">TKT-29002</p>
              <span className="text-[10px] font-bold text-amber-600 uppercase">Pending</span>
            </div>
            <p className="text-sm font-bold truncate">Speed degradation</p>
            <p className="text-xs text-muted-foreground">Reported: 2 hrs ago</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col gap-1 border-l-4 border-emerald-500">
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-muted-foreground">TKT-28841</p>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Resolved</span>
            </div>
            <p className="text-sm font-bold truncate">Router intermittent reset</p>
            <p className="text-xs text-muted-foreground">Closed: 3 days ago</p>
          </div>
        </div>
      </div>
      {/* Helpdesk History Widget */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h4 className="font-bold text-sm">Helpdesk History</h4>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MessageSquare className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Live Chat Support</p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                &quot;Inquiry about 5G router compatibility...&quot;
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Today, 09:45 AM</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <PhoneCall className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Inbound Phone Call</p>
              <p className="text-xs text-muted-foreground mt-1">Plan upgrade discussion</p>
              <p className="text-[10px] text-slate-400 mt-1">Yesterday, 02:20 PM</p>
            </div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <Button variant="secondary" className="w-full text-xs font-bold">
            View Interaction Logs
          </Button>
        </div>
      </div>
    </>
  );
}
