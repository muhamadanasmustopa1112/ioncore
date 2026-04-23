"use client";

import { RiDeleteBin7Line, RiEditLine, RiEyeLine } from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/config/paths";
import { PopData } from "../../../types/pop";
import { usePopStore } from "../../../store/pop";

export function ActionsCellOdp({ row }: { row: Row<PopData> }) {
    const router = useRouter();
    const { openPopFormSheet, setSelectedPop } = usePopStore();

    const handleEditClick = () => {
        setSelectedPop(row.original);
        openPopFormSheet("edit");
    };

    const handleDetailClick = () => {
        setSelectedPop(row.original);
        router.push(`${paths.dashboard.networkAndOrchestration.odpPop.manage.detail.getHref()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-8" size="icon" variant="ghost">
                    <EllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
                    <RiEyeLine />
                    View ODP
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => { }}
                >
                    <RiDeleteBin7Line />
                    Delete
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


