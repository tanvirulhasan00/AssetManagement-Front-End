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
import { DataTableColumnHeader } from "./custom-data-table/custom-column-header";

export type Renter = {
  id: number;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  maritalStatus: string;
  address: string;
  occupation: string;
  religion: string;
  education: string;
  phoneNumber: string;
  email: string;
  nidNumber: string;
  passportNumber: string;
  prevRoomOwnerName: string;
  prevRoomOwnerNumber: string;
  prevRoomOwnerAddress: string;
  reasonToLeavePrevHome: string;
  imageUrl: string;
  nidImageUrl: string;
  startDate: string;
  active: number;
};

export const columns: ColumnDef<Renter>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
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
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("active") == 1 ? "Active" : "InActive"}
      </div>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="capitalize w-[3rem] h-[3rem] rounded-full">
        <img
          className="w-full h-full rounded-full"
          src={row.getValue("imageUrl")}
          alt="renter_image"
        />
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const renter = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(renter.id.toString())
              }
            >
              Copy renter id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/renter/${renter.id}`}>View Renter</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
