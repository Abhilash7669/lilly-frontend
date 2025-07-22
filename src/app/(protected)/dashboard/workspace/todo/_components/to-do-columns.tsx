import { ColumnDef } from "@tanstack/react-table";

export type TaskTable = {
    id: string;
    name: string;
}

export const taskTableColumns: ColumnDef<{id: string, name: string}>[] = [
  {
    accessorKey: "id",

  },
  {
    accessorKey: "name",
    header: () => <div>Name</div>,
    cell: ({ row }) => <p className="text-white">{row.getValue("name")}</p>
  }
]