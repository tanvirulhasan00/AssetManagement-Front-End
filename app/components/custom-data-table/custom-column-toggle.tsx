import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Search, Settings2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Input } from "../ui/input";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  filterWith: string;
}

export function DataTableViewOptions<TData>({
  table,
  filterWith,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
        <Input
          placeholder={`Filter ${filterWith}...`}
          value={
            (table.getColumn(filterWith)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterWith)?.setFilterValue(event.target.value)
          }
          className="pl-10" // Push text to the right to make space for the icon
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
