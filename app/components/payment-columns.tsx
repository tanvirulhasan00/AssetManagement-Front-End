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

type Renter = {
  id: number;
  name: string;
};

export type Payment = {
  id: number;
  renter: Renter;
  transactionId: string;
  invoiceId: string;
  paymentMethod: string;
  paymentAmount: string;
  paymentDueAmount: string;
  paymentDate: string;
  lastUpdatedDate: string;
  paymentStatus: string;
};

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "renter",
    header: "Renter Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.renter.name}</div>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("transactionId")}</div>
    ),
  },
  {
    accessorKey: "invoiceId",
    header: "Invoice Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("invoiceId")}</div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentMethod")}</div>
    ),
  },
  {
    accessorKey: "paymentAmount",
    header: "Payment Amount",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentAmount")}</div>
    ),
  },
  {
    accessorKey: "paymentDueAmount",
    header: "Payment Due Amount",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentDueAmount")}</div>
    ),
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentDate")}</div>
    ),
  },
  {
    accessorKey: "lastUpdatedDate",
    header: "Last Updated Date",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("lastUpdatedDate")}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentStatus")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
                navigator.clipboard.writeText(payment.id.toString())
              }
            >
              Copy Payment ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
