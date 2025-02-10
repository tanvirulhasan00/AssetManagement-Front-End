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

import { GetAllArea, GetHouse, UpdateHouse } from "~/components/data";
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
  const { houseId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const houseData = await GetHouse(Number(houseId), token);
  const response = await GetAllArea(token);
  const house = houseData.result;
  console.log("loaderHOuse", house);
  const area = response.result;
  return { area, house };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const houseId = formData.get("id") as string;

  const formPayload = new FormData();
  formPayload.append("id", houseId);
  formPayload.append("name", formData.get("name") as string);
  formPayload.append("areaId", formData.get("areaId") as string);
  formPayload.append("totalFloor", formData.get("totalFloor") as string);
  formPayload.append("totalFlat", formData.get("totalFlat") as string);
  formPayload.append("road", formData.get("road") as string);
  formPayload.append("postCode", formData.get("postCode") as string);
  formPayload.append("active", formData.get("active") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    const response = await UpdateHouse(formPayload, token);

    if (response.success) {
      return redirect(
        `/dashboard/house?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/house/update-house/${houseId}?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/house/update-house/${houseId}?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

const UpdateHouseFunc = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { area, house } = useLoaderData<typeof loader>();
  console.log("House", house);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed",
        description: `Update ${error} with status code ${statusCode}`,
        variant: "destructive", // Default toast style
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const [formData, setFormData] = useState({
    name: house.name || "",
    areaId: house.areaId,
    totalFloor: house.totalFloor,
    totalFlat: house.totalFlat,
    road: house.road || "",
    postCode: house.postCode,
    active: house.active,
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
            <CardTitle className="text-2xl">Update House</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="id" value={house.id} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Select
                  name="areaId"
                  value={formData.areaId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, areaId: value })
                  }
                >
                  <SelectTrigger id="areaId">
                    <SelectValue placeholder="Select area name" />
                  </SelectTrigger>
                  <SelectContent>
                    {area.map((area: any) => (
                      <SelectGroup key={area.id}>
                        <SelectItem value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalFloor">Total Floor</Label>
                <Input
                  id="totalFloor"
                  name="totalFloor"
                  type="number"
                  value={formData.totalFloor}
                  onChange={handleChange}
                  placeholder="total floor"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="totalFlat">Total Flat</Label>
                <Input
                  id="totalFlat"
                  name="totalFlat"
                  value={formData.totalFlat}
                  onChange={handleChange}
                  type="number"
                  placeholder="total flat"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="road">Road</Label>
                <Input
                  id="road"
                  name="road"
                  value={formData.road}
                  onChange={handleChange}
                  type="text"
                  placeholder="road"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postCode">Post Code</Label>
                <Input
                  id="postCode"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  type="number"
                  placeholder="post code"
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
                    title: "update cancelled",
                  });
                  navigate(`/dashboard/house/`);
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

export default UpdateHouseFunc;

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
