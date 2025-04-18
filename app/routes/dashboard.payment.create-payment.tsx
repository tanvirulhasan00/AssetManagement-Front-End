import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import React, { useEffect, useState } from "react";

import { Create, GetAll } from "~/components/data";
import SearchReference from "~/components/search-ref";
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const userId = (await userIdCookie.parse(cookieHeader)) || null;
  const response = await GetAll(token, "renter");
  const responseA = await GetAll(token, "assign");
  const renters = response.result;
  const assigns = responseA.result;
  return { renters, assigns, userId };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formPayload = new FormData();
  formPayload.append("userId", formData.get("userId") as string);
  formPayload.append("assignId", formData.get("id") as string);
  formPayload.append("referenceNo", formData.get("ref") as string);
  formPayload.append("transactionId", formData.get("transactionId") as string);
  formPayload.append("paymentMethod", formData.get("paymentMethod") as string);
  formPayload.append("paymentType", formData.get("paymentType") as string);
  formPayload.append("paymentAmount", formData.get("paymentAmount") as string);
  formPayload.append("flatUtilities", formData.get("flatUtilities") as string);
  formPayload.append("paymentDue", formData.get("paymentDue") as string);

  formPayload.append(
    "paymentAdvance",
    formData.get("paymentAdvance") as string
  );
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
  const { assigns, userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [ref, setRef] = useState<string | null>(null);
  const [assignData, setAssignData] = useState<typeof assigns>();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const a = assigns.find((f: any) => f.referenceNo === ref);
    setAssignData(a);
  }, [assigns, ref]);

  // console.log(assignData?.length);

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
            <CardTitle className="text-2xl">Create Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="userId" id="userId" value={userId} />
            <Input type="hidden" value={ref?.toString()} name="ref" />
            <Input type="hidden" value={assignData?.id.toString()} name="id" />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="renter">Search Reference</Label>
                <SearchReference onChange={(reff: any) => setRef(reff)} />
              </div>

              <div hidden={!assignData ? true : false}>
                <div className="grid gap-2">
                  <Label htmlFor="renter">Renter Information</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      value={`Assign ID- ${
                        assignData && assignData.id.toString().length
                          ? assignData.id.toString()
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`Name- ${
                        assignData && assignData?.renter.name.length
                          ? assignData?.renter.name
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`Mobile- ${
                        assignData && assignData?.renter?.phoneNumber?.length
                          ? assignData?.renter.phoneNumber
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`FlatNumber- ${
                        assignData && assignData?.flat.name.length
                          ? assignData?.flat.name
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`FlatRent- ${
                        assignData && assignData?.flatRent.toString().length
                          ? assignData?.flatRent
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`DueRent- ${
                        assignData && assignData?.dueRent?.toString().length
                          ? assignData?.dueRent
                          : ""
                      }`}
                      disabled
                    />
                    <Input
                      value={`AdvanceRent- ${
                        assignData && assignData?.advanceRent.toString().length
                          ? assignData?.advanceRent
                          : ""
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
                <Label htmlFor="renter">Payment Method</Label>
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
                <Select name="paymentType">
                  <SelectTrigger id="paymentType">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"rent"}>Rent</SelectItem>
                      <SelectItem value={"duerent"}>Due Rent</SelectItem>
                      <SelectItem value={"flatadvance"}>
                        Flat Advance
                      </SelectItem>
                      <SelectItem value={"dueflatadvance"}>
                        Due Flat Advance
                      </SelectItem>
                    </SelectGroup>
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
                <Label htmlFor="flatUtilities">Flat Utilities</Label>
                <Input
                  id="flatUtilities"
                  name="flatUtilities"
                  type="text"
                  placeholder="flat utilities"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentDue">Payment Due Amount</Label>
                <Input
                  id="paymentDue"
                  name="paymentDue"
                  type="text"
                  placeholder="payment due amount"
                  defaultValue={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentAdvance">Payment Advance Amount</Label>
                <Input
                  id="paymentAdvance"
                  name="paymentAdvance"
                  type="text"
                  placeholder="payment advance amount"
                  defaultValue={0}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="renter">Payment Month</Label>
                <Select name="paymentMonth">
                  <SelectTrigger id="paymentMonth">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"January"}>January</SelectItem>
                      <SelectItem value={"February"}>February</SelectItem>
                      <SelectItem value={"March"}>March</SelectItem>
                      <SelectItem value={"April"}>April</SelectItem>
                      <SelectItem value={"May"}>May</SelectItem>
                      <SelectItem value={"June"}>June</SelectItem>
                      <SelectItem value={"July"}>July</SelectItem>
                      <SelectItem value={"August"}>August</SelectItem>
                      <SelectItem value={"September"}>September</SelectItem>
                      <SelectItem value={"October"}>October</SelectItem>
                      <SelectItem value={"November"}>November</SelectItem>
                      <SelectItem value={"December"}>December</SelectItem>
                    </SelectGroup>
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
                    title: "Create cancelled",
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
