import {
  RiCheckboxCircleFill,
  RiDeleteBin7Line,
  RiEditLine,
  RiEyeLine,
  RiFileCopy2Line,
} from "@remixicon/react";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployeeStore } from "../../../store/employee";
import { Employee } from "../../../types";

export function ActionsCell({ row }: { row: Row<Employee> }) {
  const { copyToClipboard } = useCopyToClipboard();
  const { openEmployeeFormSheet } = useEmployeeStore();

  const handleCopyId = () => {
    copyToClipboard(String(row.original.guid));
    const message = `User ID successfully copied: ${row.original.guid}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: "top-center",
      },
    );
  };

  const handleEditClick = () => {
    openEmployeeFormSheet("edit");
  };

  const handleDetailClick = () => {
    openEmployeeFormSheet("details");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
          <RiEditLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDetailClick}>
          <RiEyeLine />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleCopyId}>
          <RiFileCopy2Line />
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => {}}
        >
          <RiDeleteBin7Line />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
