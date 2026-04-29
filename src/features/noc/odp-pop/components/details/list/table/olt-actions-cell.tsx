"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { OltData } from "@/features/noc/odp-pop/types/olt";

export function OltActionsCell({ row }: { row: Row<OltData> }) {
  const router = useRouter();

  const handleManageClick = () => {
    router.push(paths.dashboard.networkAndOrchestration.odpPop.oltDetail.getHref(String(row.original.id)));
  };

  return (
    <div className="flex justify-center">
      <Button
        variant="primary"
        size="sm"
        className="h-8 px-4 font-black uppercase text-[10px] shadow-sm"
        onClick={handleManageClick}
      >
        Manage
      </Button>
    </div>
  );
}
