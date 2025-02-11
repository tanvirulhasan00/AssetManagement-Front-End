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

import { Get, GetAll, UpdateMulti } from "~/components/data";
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
import { Textarea } from "~/components/ui/textarea";
import { authCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const familyId = formData.get("id");
  const imageUrl = formData.get("imageUrl");
  const nidImageUrl = formData.get("nidImageUrl");

  const formPayload = new FormData();
  formPayload.append("id", familyId as string);
  formPayload.append("renterId", formData.get("renter") as string);
  formPayload.append("name", formData.get("name") as string);
  formPayload.append("nidNumber", formData.get("nidNumber") as string);
  formPayload.append("occupation", formData.get("occupation") as string);
  formPayload.append("relation", formData.get("relation") as string);
  formPayload.append("phoneNumber", formData.get("phoneNumber") as string);
  formPayload.append("address", formData.get("address") as string);
  if (imageUrl instanceof File) formPayload.append("imageUrl", imageUrl);
  if (nidImageUrl instanceof File)
    formPayload.append("nidImageUrl", nidImageUrl);
  formPayload.append(
    "isEmergencyContact",
    formData.get("isEmergencyContact") as string
  );
  formPayload.append("active", formData.get("active") as string);

  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  try {
    const response = await UpdateMulti(formPayload, token, "family-member");

    if (response.success) {
      return redirect(
        `/dashboard/family-member?message=${response.message}&status=${response.statusCode}`
      );
    } else {
      return redirect(
        `/dashboard/family-member/update-family/${familyId}?error=${response.message}&status=${response.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/family-member/update-family/${familyId}?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { familyId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const familyRes = await Get(Number(familyId), token, "family-member");
  const renterRes = await GetAll(token, "renter");
  const renter = renterRes.result;
  const familyMember = familyRes.result;

  // Sort by date (latest first)
  const sortedRenters = renter.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  return { sortedRenters, familyMember };
};

const UpdateFamilyMEmberFunc = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const navigate = useNavigate();
  const { sortedRenters, familyMember } = useLoaderData<typeof loader>();
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
    name: familyMember.name || "",
    nidNumber: familyMember.nidNumber || "",
    occupation: familyMember.occupation || "",
    relation: familyMember.relation || "",
    phoneNumber: familyMember.phoneNumber || "",
    address: familyMember.address || "",
    isEmergencyContact: familyMember.isEmergencyContact,
    renterId: familyMember.renterId,
    active: familyMember.active,
  });
  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Create Family-Member</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form method="post" encType="multipart/form-data">
            <Input type="hidden" name="id" id="id" value={familyMember.id} />
            <div className="grid gap-2">
              <Label htmlFor="renter">Renter</Label>
              <Select
                name="renter"
                value={formData.renterId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, renterId: value })
                }
              >
                <SelectTrigger id="renter">
                  <SelectValue placeholder="Select Renter" />
                </SelectTrigger>
                <SelectContent>
                  {sortedRenters.map((rent: any) => (
                    <SelectGroup key={rent.id}>
                      <SelectItem value={rent.id.toString()}>
                        Id: {rent.id} Name: {rent.name}
                      </SelectItem>
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <Label htmlFor="nidNumber">Nid Number</Label>
                <Input
                  id="nidNumber"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="nid number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thana">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  type="text"
                  placeholder="occupation"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relation">Relation</Label>
                <Input
                  id="relation"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  type="text"
                  placeholder="relation"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="phoneNumber"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  name="address"
                  id="address"
                  placeholder="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              {[
                { id: "imageUrl", label: "Image" },
                { id: "nidImageUrl", label: "NID Picture" },
              ].map(({ id, label }) => (
                <div key={id} className="grid gap-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} name={id} type="file" />
                </div>
              ))}
              <div className="grid gap-2">
                <Select
                  name="isEmergencyContact"
                  value={formData.isEmergencyContact.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isEmergencyContact: value })
                  }
                >
                  <SelectTrigger id="isEmergencyContact">
                    <SelectValue placeholder="Select as emergency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"1"}>Emergency</SelectItem>
                      <SelectItem value={"0"}>No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                  navigate("/dashboard/family-member");
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

export default UpdateFamilyMEmberFunc;

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
