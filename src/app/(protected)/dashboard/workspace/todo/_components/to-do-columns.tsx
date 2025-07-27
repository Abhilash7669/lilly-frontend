import PriorityBadge from "@/components/common/indicator/priority-badge";
import {
  Priority,
  StatusValue,
} from "@/app/(protected)/dashboard/workspace/todo/_types/type";
import TableHeaderItem from "@/components/common/table/table-header-item";
import TableRowItem from "@/components/common/table/table-row-item";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/common/indicator/status-badge";

export type TaskTable = {
  id: string;
  name: string;
  priority: Priority;
  status: StatusValue;
  startDate: string;
  dueDate: string;
};

export const taskTableColumns: ColumnDef<TaskTable>[] = [
  {
    id: "select",
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="cursor-pointer"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TableHeaderItem column={column} text="Name" />,
    cell: ({ row }) => <TableRowItem text={row.getValue("name")} />,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <TableHeaderItem column={column} text="Priority" />,
    cell: ({ row }) => {
      const _priority: Priority = row.getValue("priority");
      return <PriorityBadge variant={_priority || "medium"} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TableHeaderItem column={column} text="Status" />,
    cell: ({ row }) => {
      const _status: StatusValue = row.getValue("status");
      return <StatusBadge variant={_status || "todo"} />;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <TableHeaderItem column={column} text="Start Date" />
    ),
    cell: ({ row }) => <TableRowItem text={row.getValue("startDate")} />,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <TableHeaderItem column={column} text="Due Date" />,
    cell: ({ row }) => <TableRowItem text={row.getValue("dueDate")} />,
  },
];
