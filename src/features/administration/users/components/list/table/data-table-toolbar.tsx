import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardToolbar } from "@/components/ui/card";
import { useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";

export const DataTableToolbar = () => {
  const { table } = useDataGrid();
  return (
    <CardToolbar>
      <DataGridColumnVisibility
        table={table}
        trigger={<Button variant="outline"><Settings2 />View</Button>}
      />
    </CardToolbar>
  );
};
