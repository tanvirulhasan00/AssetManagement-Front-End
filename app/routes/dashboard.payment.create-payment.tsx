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
import React, { useEffect } from "react";

import { Create, GetAll } from "~/components/data";
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
  const renters = response.result;
  return { renters, userId };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formPayload = new FormData();
  formPayload.append("userId", formData.get("userId") as string);
  formPayload.append("renterId", formData.get("renterId") as string);
  formPayload.append("transactionId", formData.get("transactionId") as string);
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
  const { renters, userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

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
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Select name="renterId">
                  <SelectTrigger id="renterId">
                    <SelectValue placeholder="Select renter" />
                  </SelectTrigger>
                  <SelectContent>
                    {renters.map((renter: any) => (
                      <SelectGroup key={renter.id}>
                        <SelectItem value={renter.id.toString()}>
                          {renter.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"></div>
              <div className="grid gap-2">
                <Label htmlFor="transactionId">Transaction Number</Label>
                <Input
                  id="transactionId"
                  name="transactionId"
                  type="text"
                  placeholder="transaction number"
                />
              </div>

              <div className="grid gap-2">
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
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  placeholder="payment amount"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentDueAmount">Payment Due Amount</Label>
                <Input
                  id="paymentDueAmount"
                  name="paymentDueAmount"
                  type="number"
                  placeholder="payment due amount"
                  defaultValue={0}
                />
              </div>
              <div className="grid gap-2">
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
                Create
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
