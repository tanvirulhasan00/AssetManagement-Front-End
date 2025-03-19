import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router";

type Area = {
  id: number;
  name: string;
};
export type House = {
  id: number;
  name: string;
  area: Area;
  totalFloor: number;
  totalFlat: number;
  road: string;
  postCode: number;
  active: number;
};

export const columns: ColumnDef<House>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "area",
    header: "Area Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.area.name ?? "no name"}</div>
    ),
  },
  {
    accessorKey: "totalFloor",
    header: "Total Floor",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalFloor")}</div>
    ),
  },
  {
    accessorKey: "totalFlat",
    header: "Total Flat",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalFlat")}</div>
    ),
  },
  {
    accessorKey: "road",
    header: "Road",
    cell: ({ row }) => <div className="capitalize">{row.getValue("road")}</div>,
  },
  {
    accessorKey: "postCode",
    header: "Post Code",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("postCode")}</div>
    ),
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("active") == 1 ? "Active" : "InActive"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const house = row.original;

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
              onClick={() => navigator.clipboard.writeText(house.id.toString())}
            >
              Copy House ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/house/update-house/${house.id}`}>
                Update House
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
