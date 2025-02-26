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
import { useEffect, useState } from "react";

import { Create, Get, GetAll } from "~/components/data";
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
import { authCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const formPayload = new FormData();
  formPayload.append("renterId", formData.get("renter") as string);
  formPayload.append("flatId", formData.get("flat") as string);
  formPayload.append("flatPrice", formData.get("flatPrice") as string);
  formPayload.append(
    "flatAdvanceAmountGiven",
    formData.get("flatAdvanceAmountGiven") as string
  );
  formPayload.append(
    "flatAdvanceAmountDue",
    formData.get("flatAdvanceAmountDue") as string
  );
  formPayload.append("active", formData.get("active") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    const response = await Create(formPayload, token, "assign");

    if (response.success) {
      return redirect(
        `/dashboard/assign?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/assign/create-assign?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/assign/create-assign?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const renterRes = await GetAll(token, "renter");
  const flatRes = await GetAll(token, "flat");
  const filterFlat = flatRes.result;
  const renter = renterRes.result;
  const flat = filterFlat.filter(
    (item: any) => !item.assignedId || item.assignedId.trim() === ""
  );

  return { renter, flat, token };
};

const CreateAssign = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const navigate = useNavigate();
  const { renter, flat, token } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (statusCode != "200" && error) {
      toast({
        title: "Failed",
        description: `Create ${error} with status code ${statusCode}`,
        variant: "destructive", // Default toast style
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const [formData, setFormData] = useState({
    flatPrice: "",
    flatAdvance: "",
    flatAdvanceDue: 0,
    flatAdvanceFixed: 0,
  });

  const handleValueChange = async (value: string) => {
    const singleFlat = await Get(Number(value), token, "flat");
    const flat = singleFlat.result;
    setFormData({
      ...formData,
      flatPrice: flat.category.price,
      flatAdvance: flat.flatAdvanceAmount,
      flatAdvanceFixed: flat.flatAdvanceAmount,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      flatPrice: e.target.value,
    });
  };
  const handleChangeAdvance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      flatAdvance: e.target.value,
      flatAdvanceDue: formData.flatAdvanceFixed - Number(e.target.value),
    });
  };
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Assign Renter</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            {/* <Input type="hidden" name="id" /> */}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="renter">Renter</Label>
                <Select name="renter">
                  <SelectTrigger id="renter">
                    <SelectValue placeholder="Select renter" />
                  </SelectTrigger>
                  <SelectContent>
                    {renter.map((rent: any) => (
                      <SelectGroup key={rent.id}>
                        <SelectItem value={rent.id.toString()}>
                          {rent.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flat">Flat</Label>
                <Select
                  name="flat"
                  onValueChange={(value) => handleValueChange(value)}
                >
                  <SelectTrigger id="flat">
                    <SelectValue placeholder="Select flat" />
                  </SelectTrigger>
                  <SelectContent>
                    {flat.length > 0 ? (
                      flat.map((fla: any) => (
                        <SelectGroup key={fla.id}>
                          <SelectItem value={fla.id.toString()}>
                            {fla.name}
                          </SelectItem>
                        </SelectGroup>
                      ))
                    ) : (
                      <SelectGroup>
                        <SelectItem value="no">
                          No Empty Flat To Assign
                        </SelectItem>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flatPrice">Flat Price</Label>
                <Input
                  id="flatPrice"
                  name="flatPrice"
                  value={formData.flatPrice}
                  onChange={handleChange}
                  type="number"
                  placeholder="flat price"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flatAdvanceAmountGiven">Flat Advance</Label>
                <Input
                  id="flatAdvanceAmountGiven"
                  name="flatAdvanceAmountGiven"
                  value={formData.flatAdvance}
                  onChange={handleChangeAdvance}
                  type="number"
                  placeholder="flat advance"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flatAdvanceAmountDue">Flat Advance Due</Label>
                <Input
                  id="flatAdvanceAmountDue"
                  name="flatAdvanceAmountDue"
                  value={formData.flatAdvanceDue}
                  // onChange={handleChange}
                  type="number"
                  placeholder="flat advance due"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Select name="active">
                  <SelectTrigger id="active">
                    <SelectValue placeholder="Select active status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"1"}>Active</SelectItem>
                      <SelectItem value={"0"}>InActive</SelectItem>
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
                  // navigate(-1);
                  navigate("/dashboard/assign");
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

export default CreateAssign;

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
