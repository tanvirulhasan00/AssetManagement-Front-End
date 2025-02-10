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

export type District = {
  id: number;
  name: string;
  active: number;
};

export type Division = {
  id: number;
  name: string;
  active: number;
};

export type Location = {
  id: number;
  name: string;
  districtId: number;
  district: District;
  divisionId: number;
  division: Division;
  subDistrict: string;
  thana: string;
  mouza: string;
  active: number;
  createdDate: string;
  updatedDate: string;
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.district.name}</div>
    ),
  },
  {
    accessorKey: "thana",
    header: "Thana",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("thana")}</div>
    ),
  },
  {
    accessorKey: "mouza",
    header: "Mouza",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("mouza")}</div>
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
      const area = row.original;

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
              onClick={() => navigator.clipboard.writeText(area.id.toString())}
            >
              Copy Area ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard/area/update-area/${area.id}`}>
                Update Area
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              {/* <Button
                variant={"destructive"}
                onClick={async () => (
                  await Delete(Number(area.id), token, "area"),
                  window.location.reload()
                )}
              >
                Delete Area
              </Button> */}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
