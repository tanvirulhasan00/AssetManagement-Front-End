import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

export type History = {
  id: number;
  actionName: string;
  actionById: string;
  actionByName: string;
  actionDate: string;
};

export const columns: ColumnDef<History>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "actionName",
    header: "Action Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("actionName")}</div>
    ),
  },
  {
    accessorKey: "actionById",
    header: "Action By",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("actionById")}</div>
    ),
  },
  {
    accessorKey: "actionByName",
    header: "Action By Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("actionByName")}</div>
    ),
  },
  {
    accessorKey: "actionDate",
    header: "Action Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("actionDate")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const history = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(history.id.toString())
              }
            >
              Copy History ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
