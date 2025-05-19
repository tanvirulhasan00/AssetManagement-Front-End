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
import { useEffect, useState } from "react";

import { Get, GetAll, Update } from "~/components/data";
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { flatId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const responseF = await Get(Number(flatId), token, "flat");
  const responseC = await GetAll(token, "category");
  const responseH = await GetAll(token, "house");
  const flat = responseF.result;
  const category = responseC.result;
  const house = responseH.result;
  return { flat, category, house };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const flatId = formData.get("id") as string;
  const formPayload = new FormData();
  formPayload.append("id", flatId);
  formPayload.append("name", formData.get("name") as string);
  // formPayload.append("floorNo", formData.get("floorNo") as string);
  formPayload.append("totalRoom", formData.get("totalRoom") as string);
  formPayload.append("flatAdvance", formData.get("flatAdvance") as string);
  formPayload.append("categoryId", formData.get("categoryId") as string);
  // formPayload.append("houseId", formData.get("houseId") as string);
  formPayload.append("active", formData.get("active") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  console.log("flat", formPayload);

  try {
    const response = await Update(formPayload, token, "flat");

    if (response.success) {
      return redirect(
        `/dashboard/flat?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/flat/update-flat/${flatId}?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/flat/update-flat/${flatId}?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

const FlatHouseFunc = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { flat, category } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed",
        description: `${error} with status code ${statusCode}`,
        variant: "destructive", // Default toast style
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const [formData, setFormData] = useState({
    name: flat.name || "",
    // floorNo: flat.floorNo,
    totalRoom: flat.totalRoom,
    flatAdvance: flat.flatAdvance,
    // houseId: flat.house.id,
    categoryId: flat.category.id,
    active: flat.active,
  });
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Update Flat</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="id" id="id" value={flat.id} />
            <div className="flex flex-col gap-6">
              {/* <div className="grid gap-2">
                <Select
                  name="houseId"
                  value={formData.houseId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, houseId: value })
                  }
                >
                  <SelectTrigger id="houseId">
                    <SelectValue placeholder="Select house name" />
                  </SelectTrigger>
                  <SelectContent>
                    {house.map((hous: any) => (
                      <SelectGroup key={hous.id}>
                        <SelectItem value={hous.id.toString()}>
                          {hous.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className="grid gap-2">
                <Select
                  name="categoryId"
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category name" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.map((cat: any) => (
                      <SelectGroup key={cat.id}>
                        <SelectItem value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="name"
                  required
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="floorNo">Floor no</Label>
                <Input
                  id="floorNo"
                  name="floorNo"
                  value={formData.floorNo}
                  onChange={handleChange}
                  type="number"
                  placeholder="floor no"
                  required
                />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="totalRoom">Total Room</Label>
                <Input
                  id="totalRoom"
                  name="totalRoom"
                  value={formData.totalRoom}
                  onChange={handleChange}
                  type="number"
                  placeholder="total room"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flatAdvance">Flat Advance</Label>
                <Input
                  id="flatAdvance"
                  name="flatAdvance"
                  value={formData.flatAdvance}
                  onChange={handleChange}
                  type="number"
                  placeholder="flat advance"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Select
                  name="active"
                  value={formData.active.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, active: value })
                  }
                >
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
                Update
              </Button>
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Update cancelled",
                  });
                  navigate("/dashboard/flat");
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

export default FlatHouseFunc;

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
