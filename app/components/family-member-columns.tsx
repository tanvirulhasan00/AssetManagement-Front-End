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

export type Renter = {
  id: number;
  name: string;
};

export type FamilyMember = {
  id: number;
  name: string;
  nidNumber: string;
  occupation: string;
  relation: string;
  phoneNumber: string;
  address: string;
  isEmergencyContact: number;
  renter: Renter;
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
    accessorKey: "nidNumber",
    header: "NidNumber",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nidNumber")}</div>
    ),
  },
  {
    accessorKey: "relation",
    header: "Relation",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("relation")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Mobile",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "isEmergencyContact",
    header: "EmergencyContact",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("isEmergencyContact") == 1 ? "Emergency" : "No"}
      </div>
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
      const family = row.original;

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
                navigator.clipboard.writeText(family.id.toString())
              }
            >
              Copy Family-Member ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/family-member/update-family/${family.id}`}>
                Update Family-Member
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
