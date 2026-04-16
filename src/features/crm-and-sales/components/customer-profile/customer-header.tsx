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
