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

type Category = {
  id: number;
  name: string;
  price: number;
};
type House = {
  id: number;
  name: string;
};

type FamilyMember = {
  id: number;
  name: string;
  floorNo: string;
  totalRoom: number;
  assignedId: number;
  category: Category;
  house: House;
  active: number;
};

export const columns: ColumnDef<FamilyMember>[] = [
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
    accessorKey: "floorNo",
    header: "Floor No",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("floorNo")}</div>
    ),
  },
  {
    accessorKey: "totalRoom",
    header: "Total Room",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalRoom")}</div>
    ),
  },
  {
    accessorKey: "house",
    header: "House Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.house.name}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.category.name}</div>
    ),
  },
  {
    accessorKey: "assignedId",
    header: "Assigned Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("assignedId")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Flat Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.category.price.toString());
      // formate the amount as a BDT
      const formatted = new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
      }).format(amount);
      return <div className=" font-medium">{formatted}</div>;
    },
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
      const flat = row.original;

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
              onClick={() => navigator.clipboard.writeText(flat.id.toString())}
            >
              Copy Flat ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/flat/update-flat/${flat.id}`}>
                Update Flat
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
