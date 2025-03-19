import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "react-router";
import React, { useEffect, useState } from "react";

import { Create, Get, GetAll, Update } from "~/components/data";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { authCookie, userIdCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { paymentId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const userId = (await userIdCookie.parse(cookieHeader)) || null;
  const response = await Get(Number(paymentId), token, "payment");
  const payments = response.result;
  return { payments, userId };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formPayload = new FormData();
  formPayload.append("userId", formData.get("userId") as string);
  formPayload.append("paymentMethod", formData.get("paymentMethod") as string);
  formPayload.append("paymentAmount", formData.get("paymentAmount") as string);
  formPayload.append(
    "paymentDueAmount",
    formData.get("paymentDueAmount") as string
  );

  formPayload.append("paymentStatus", formData.get("paymentStatus") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    const response = await Update(formPayload, token, "payment");

    if (response.success) {
      return redirect(
        `/dashboard/payment?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/payment/create-payment?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/payment/create-payment?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

const CreateHouseFunc = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { payments, userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: `Failed status code ${statusCode}`,
        description: `${error}`,
        variant: "destructive", // Default toast style
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const [formData, setFormData] = useState({
    renterName: payments.renter.name,
  });

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Create Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="userId" id="userId" value={userId} />
            <Input
              type="hidden"
              name="paymentId"
              id="paymentId"
              value={payments.id}
            />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="renter">Renter Name</Label>
                <Select name="renterId" value={payments.renterId}>
                  <SelectTrigger id="renterId">
                    <SelectValue placeholder="Select renter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={payments.renterId}>
                        {payments.renter.name}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transactionId">Transaction Number</Label>
                <Input
                  id="transactionId"
                  name="transactionId"
                  type="text"
                  value={payments.transactionId}
                  placeholder="transaction number"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paymentAmount">Payment Method</Label>
                <Select name="paymentMethod" value={payments.paymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"cash"}>Cash</SelectItem>
                      <SelectItem value={"bank"}>Bank</SelectItem>
                      <SelectItem value={"bkash"}>Bkash</SelectItem>
                      <SelectItem value={"nagad"}>Nagad</SelectItem>
                      <SelectItem value={"rocket"}>Rocket</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentAmount">Payment Amount Given</Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  placeholder="payment amount"
                  value={payments.paymentAmount}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentDueAmount1">Payment Due Amount</Label>
                <Input
                  id="paymentDueAmount1"
                  name="paymentDueAmount1"
                  type="number"
                  value={payments.paymentDue}
                  placeholder="due amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentDueAmount">
                  Enter Due Amount To Pay
                </Label>
                <Input
                  id="paymentDueAmount"
                  name="paymentDueAmount"
                  type="number"
                  value={payments.paymentDueAmount}
                  placeholder="pay due amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select name="paymentStatus" value={payments.paymentStatus}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"paid"}>Paid</SelectItem>
                      <SelectItem value={"due"}>Due</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Pay Due
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Payment cancelled",
                  });
                  navigate("/dashboard/payment");
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateHouseFunc;

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      toast({
        variant: "destructive",
        title: `${error.status} ${error.statusText}`,
        description: error.data?.toString() || "Something went wrong.",
      });
    } else if (error instanceof Error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Unknown Error",
        description: "An unexpected error occurred.",
      });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Oops! Something went wrong.
        </h1>
        {isRouteErrorResponse(error) ? (
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
            {error.status}: {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
            {error.message}
          </p>
        ) : (
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
            Unknown error occurred.
          </p>
        )}
        <a
          href="/"
          className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
