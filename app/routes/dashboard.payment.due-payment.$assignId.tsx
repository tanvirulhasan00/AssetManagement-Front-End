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
import React, { useEffect } from "react";

import { Create, Get, GetAssign } from "~/components/data";
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
import { BdtCurrencyFormate } from "~/components/bdt-currency";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { assignId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const userId = (await userIdCookie.parse(cookieHeader)) || null;
  const formPayload = new FormData();
  formPayload.append("assignId", assignId as string);
  const response = await GetAssign(formPayload, token);
  const responsePaymentStatus = await Get(
    Number(assignId),
    token,
    "monthly-payment-status"
  );
  const assigns = response.result;
  const monthlyPaymentStatus = responsePaymentStatus.result;
  return { assigns, monthlyPaymentStatus, userId };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const assignId = formData.get("id") as string;

  const formPayload = new FormData();
  formPayload.append("userId", formData.get("userId") as string);
  formPayload.append("assignId", assignId);
  formPayload.append("referenceNo", formData.get("ref") as string);
  formPayload.append("transactionId", formData.get("transactionId") as string);
  formPayload.append("paymentMethod", formData.get("paymentMethod") as string);
  formPayload.append("paymentType", formData.get("paymentType") as string);
  formPayload.append("paymentAmount", formData.get("paymentAmount") as string);

  formPayload.append("flatUtilities", "0");
  formPayload.append("paymentDue", "0");
  formPayload.append("paymentAdvance", "0");

  formPayload.append("paymentMonth", formData.get("paymentMonth") as string);
  formPayload.append("paymentYear", formData.get("paymentYear") as string);
  formPayload.append("paymentStatus", formData.get("paymentStatus") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    console.log("f", formPayload);
    const response = await Create(formPayload, token, "payment");

    if (response.success) {
      return redirect(
        `/dashboard/assign/view-assign/${assignId}?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/payment/rent-payment/${assignId}?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/payment/rent-payment/${assignId}?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

const CreatePaymentFunc = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { assigns, monthlyPaymentStatus, userId } =
    useLoaderData<typeof loader>();
  const dueMonths = Object.keys(monthlyPaymentStatus).filter(
    (month) => monthlyPaymentStatus[month.toLowerCase()] === "due"
  );
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    console.log(error);
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

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Due Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="userId" id="userId" value={userId} />
            <Input type="hidden" value={assigns.referenceNo} name="ref" />
            <Input type="hidden" value={assigns.id} name="id" />
            <div className="flex flex-col gap-6">
              <div>
                <div className="grid gap-2">
                  <Label htmlFor="renter">Renter Information</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      value={`Reference Number- ${
                        assigns && assigns.referenceNo.length
                          ? assigns.referenceNo
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`Name- ${
                        assigns && assigns?.renter.name.length
                          ? assigns?.renter.name
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`Mobile- ${
                        assigns && assigns?.renter?.phoneNumber?.length
                          ? assigns?.renter.phoneNumber
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`FlatNumber- ${
                        assigns && assigns?.flat.name.length
                          ? assigns?.flat.name
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`FlatRent- ${
                        assigns && assigns?.flatRent.toString().length
                          ? BdtCurrencyFormate(assigns?.flatRent)
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`DueRent- ${
                        assigns && assigns?.dueRent?.toString().length
                          ? BdtCurrencyFormate(assigns.dueRent)
                          : "No data"
                      }`}
                      disabled
                    />
                    <Input
                      value={`AdvanceRent- ${
                        assigns && assigns.advanceRent.toString().length
                          ? BdtCurrencyFormate(assigns.advanceRent)
                          : "No data"
                      }`}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transactionId">
                  Transaction Number (Optional)
                </Label>
                <Input
                  id="transactionId"
                  name="transactionId"
                  type="text"
                  placeholder="transaction number"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select name="paymentMethod">
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
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select name="paymentType" defaultValue="duerent">
                  <SelectTrigger id="paymentType">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duerent">Due Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="text"
                  placeholder="payment amount"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentMonth">Payment Month</Label>
                <Select name="paymentMonth">
                  <SelectTrigger id="paymentMonth">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {dueMonths.length > 0 ? (
                      dueMonths.map((month, index) => (
                        <SelectItem
                          key={index}
                          value={month.charAt(0).toUpperCase() + month.slice(1)}
                        >
                          {month.charAt(0).toUpperCase() + month.slice(1)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-data">
                        No due month
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentYear">Payment Year</Label>
                <Input
                  id="paymentYear"
                  name="paymentYear"
                  type="text"
                  placeholder="payment year"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select name="paymentStatus">
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
                Pay
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Payment cancelled",
                  });
                  navigate(`/dashboard/assign/view-assign/${assigns.id}`);
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

export default CreatePaymentFunc;

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
