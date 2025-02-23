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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const areaId = formData.get("id") as string;

  const formPayload = new FormData();
  formPayload.append("id", areaId);
  formPayload.append("name", formData.get("name") as string);
  formPayload.append("districtId", formData.get("district") as string);
  formPayload.append("divisionId", formData.get("division") as string);
  formPayload.append("subDistrict", formData.get("subdis") as string);
  formPayload.append("thana", formData.get("thana") as string);
  formPayload.append("mouza", formData.get("mouza") as string);
  formPayload.append("active", formData.get("active") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    const response = await Update(formPayload, token, "area");

    if (response.success) {
      return redirect(
        `/dashboard/area?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/area/update-area?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/area/update-area?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { areaId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const areaRes = await Get(Number(areaId), token, "area");
  const disRes = await GetAll(token, "district");
  const divRes = await GetAll(token, "division");
  const district = disRes.result;
  const division = divRes.result;
  const area = areaRes.result;

  return { area, district, division };
};

const EditArea = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const navigate = useNavigate();
  const { area, district, division } = useLoaderData<typeof loader>();
  console.log("up-area", area);

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
    name: area.name || "",
    districtId: area.districtId,
    divisionId: area.divisionId,
    subDistrict: area.subDistrict || "",
    thana: area.thana || "",
    mouza: area.mouza || "",
    active: area.active,
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
            <CardTitle className="text-2xl">Create Area</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input type="hidden" name="id" value={area.id} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Area Name</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="division">Division</Label>
                <Select
                  name="division"
                  value={formData.divisionId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, divisionId: value })
                  }
                >
                  <SelectTrigger id="division">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {division.map((div: any) => (
                      <SelectGroup key={div.id}>
                        <SelectItem value={div.id.toString()}>
                          {div.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">District</Label>
                <Select
                  name="district"
                  value={formData.districtId.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, districtId: value })
                  }
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {district.map((dist: any) => (
                      <SelectGroup key={dist.id}>
                        <SelectItem value={dist.id.toString()}>
                          {dist.name}
                        </SelectItem>
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subdis">Sub District</Label>
                <Input
                  id="subdis"
                  name="subdis"
                  value={formData.subDistrict}
                  onChange={handleChange}
                  type="text"
                  placeholder="sub district"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thana">Thana</Label>
                <Input
                  id="thana"
                  name="thana"
                  value={formData.thana}
                  onChange={handleChange}
                  type="text"
                  placeholder="thana"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mouza">Mouza</Label>
                <Input
                  id="mouza"
                  name="mouza"
                  value={formData.mouza}
                  onChange={handleChange}
                  type="text"
                  placeholder="mouza"
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
                  // navigate(-1);
                  navigate("/dashboard/area");
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

export default EditArea;

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
