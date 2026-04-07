import { Users, RefreshCw, AlertTriangle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiCardProps } from "../types/customer";

function KpiCard({ title, value, icon, colorClassName }: KpiCardProps) {
  return (
    <div className="bg-card dark:bg-slate-900 flex items-stretch rounded-lg shadow-sm border border-outline overflow-hidden transition-all hover:shadow-md h-[90px]">
      <div className={cn("w-16 flex items-center justify-center text-white shrink-0", colorClassName)}>
        {icon}
      </div>
      <div className="p-4 flex flex-col justify-center gap-1">
        <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-tight">
          {title}
        </span>
        <span className="text-2xl font-bold text-foreground leading-none">
          {value}
        </span>
      </div>
    </div>
  );
}

export function CustomerKpiCards() {
  const cards = [
    {
      title: "Registration This Month",
      value: 0,
      icon: <Users className="size-8 stroke-[1.5px]" />,
      colorClassName: "bg-primary",
    },
    {
      title: "Renewal This Month",
      value: 0,
      icon: <RefreshCw className="size-8 stroke-[1.5px]" />,
      colorClassName: "bg-[#00A86B]",
    },
    {
      title: "Suspended Customers",
      value: 972,
      icon: <AlertTriangle className="size-8 stroke-[1.5px]" />,
      colorClassName: "bg-[#F9A602]",
    },
    {
      title: "Account Disabled",
      value: 1,
      icon: <Ban className="size-8 stroke-[1.5px]" />,
      colorClassName: "bg-[#DC143C]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
      {cards.map((card, index) => (
        <KpiCard key={index} {...card} />
      ))}
    </div>
  );
}
