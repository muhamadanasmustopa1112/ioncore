import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardToolbar } from "@/components/ui/card";
import { useDataGrid } from "@/components/ui/data-grid";
import { DataGridColumnVisibility } from "@/components/ui/data-grid-column-visibility";

export const DataTableToolbar = () => {
  const { table } = useDataGrid();

  return (
    <CardToolbar>
      <Button>
        <Settings2 size={16} />
        Filters
      </Button>
      <DataGridColumnVisibility
        table={table}
        trigger={
          <Button variant="outline">
            <Settings2 />
            Columns
          </Button>
        }
      />
    </CardToolbar>
  );
};
