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
import { Link } from "@remix-run/react";

export type Renter = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  price: number;
};
export type Flat = {
  id: number;
  name: string;
  category: Category;
};

export type Location = {
  id: number;
  referenceNo: string;
  renter: Renter;
  flat: Flat;
  flatPrice: number;
  active: number;
};

export const columns: ColumnDef<Location>[] = [
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
    accessorKey: "referenceNo",
    header: "Reference Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("referenceNo")}</div>
    ),
  },
  {
    accessorKey: "renter",
    header: "Renter Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.renter.name}</div>
    ),
  },
  {
    accessorKey: "flat",
    header: "Flat Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.flat.name}</div>
    ),
  },

  {
    accessorKey: "flatPrice",
    header: "Flat Price",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("flatPrice")}</div>
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
      const assign = row.original;

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
                navigator.clipboard.writeText(assign.id.toString())
              }
            >
              Copy Assign ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/assign/update-assign/${assign.id}`}>
                Update Assign Data
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              {/* <Button
                variant={"destructive"}
                onClick={async () => (
                  await Delete(Number(assign.id), token, "assign"),
                  window.location.reload()
                )}
              >
                Delete Assign Data
              </Button> */}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
