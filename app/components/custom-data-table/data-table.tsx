import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import React from "react";
import { DataTablePagination } from "./custom-pagination";
import { DataTableViewOptions } from "./custom-column-toggle";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CircleAlert } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (ids: string[]) => void;
  filterWith: string;
  btnName: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  filterWith,
  btnName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  }); // Default page size

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (rowSelection) => {
      setRowSelection(rowSelection);
    },
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Function to get the selected row IDs
  const getSelectedRowIds = () => {
    return table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id.toString()); // Extract "id" of selected rows
  };

  // Handle delete action
  const handleDelete = () => {
    const selectedIds = getSelectedRowIds();
    if (selectedIds.length > 0) {
      onDelete(selectedIds); // Call the callback function with selected IDs
    }
  };

  return (
    <div>
      <DataTableViewOptions table={table} filterWith={filterWith} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {/* Conditionally Render Delete Button */}
      {getSelectedRowIds().length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              {btnName} {getSelectedRowIds().length}{" "}
              {getSelectedRowIds().length > 1 ? "items" : "item"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center">
                <CircleAlert className="text-red-600" />
                Are you sure!
              </DialogTitle>
              <DialogDescription>
                {getSelectedRowIds().length > 1 ? "Items" : "Item"} will{" "}
                {btnName.toLowerCase()} permanently.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="destructive" onClick={handleDelete}>
                {btnName} {getSelectedRowIds().length}{" "}
                {getSelectedRowIds().length > 1 ? "items" : "item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
