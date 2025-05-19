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

type Assign = {
  id: number;
  referenceNo: string;
};

export type Payment = {
  id: number;
  referenceNo: Assign;
  transactionId: string;
  invoiceId: string;
  paymentMethod: string;
  paymentType: string;
  paymentAmount: string;
  flatUtilities: string;
  paymentDue: string;
  paymentAdvance: string;
  paymentMonth: string;
  paymentYear: string;
  paymentDate: string;
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
    accessorKey: "referenceNo",
    header: "Reference Number",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("referenceNo")}</div>
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
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="capitalize">{`${
        row.original.paymentType
      } - ${row.original.paymentMonth.slice(
        0,
        3
      )}${row.original.paymentYear.slice(2, 4)}`}</div>
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
    accessorKey: "flatUtilities",
    header: "Flat Utilities",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("flatUtilities")}</div>
    ),
  },
  {
    accessorKey: "paymentDue",
    header: "Payment Due",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentDue")}</div>
    ),
  },
  {
    accessorKey: "paymentAdvance",
    header: "Payment Advance",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("paymentAdvance")}</div>
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
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
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
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>
              <Link to={`/dashboard/payment/due-payment/${payment.id}`}>
                Due Payment
              </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
