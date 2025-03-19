import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "~/hooks/use-toast";
import { authCookie } from "~/cookies.server";
import { Get, UpdateMulti } from "~/components/data";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { renterId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  const response = await Get(Number(renterId), token, "renter");
  const renter = await response.result;

  if (!response.success) {
    redirect(
      `/dashboard/renter?error=${response.data.message}&status=${response.data.statusCode}`
    );
  }
  return { renter };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const renterId = formData.get("id") as string; // Retrieve ID
  try {
    const cookieHeader = request.headers.get("Cookie");
    const token = (await authCookie.parse(cookieHeader)) || null;

    // Extract fields safely
    const fields = [
      "id",
      "name",
      "fatherName",
      "motherName",
      "dateOfBirth",
      "maritalStatus",
      "address",
      "occupation",
      "religion",
      "education",
      "phoneNumber",
      "email",
      "nidNumber",
      "passportNumber",
      "prevRoomOwnerName",
      "prevRoomOwnerNumber",
      "prevRoomOwnerAddress",
      "reasonToLeavePrevHome",
      "imageUrl",
      "nidImageUrl",
      "startDate",
      "active",
    ];

    const data: Record<string, string> = {};
    for (const field of fields) {
      const value = formData.get(field) as string;
      data[field] = value?.toString();
    }

    // Extract files separately
    const imageUrl = formData.get("imageUrl");
    const nidImageUrl = formData.get("nidImageUrl");

    // Prepare FormData for API request
    const formPayload = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formPayload.append(key, value)
    );

    if (imageUrl instanceof File) formPayload.append("imageUrl", imageUrl);
    if (nidImageUrl instanceof File)
      formPayload.append("nidImageUrl", nidImageUrl);

    console.log(
      "Submitting registration:",
      Object.fromEntries(formPayload.entries())
    );

    // Send API request
    const response = await UpdateMulti(formPayload, token, "renter");

    return redirect(
      response.success
        ? `/dashboard/renter/${renterId}?status=${encodeURIComponent(
            response.statusCode
          )}&message=${encodeURIComponent(response.message)}`
        : `/dashboard/renter/update-renter/${renterId}?error=${encodeURIComponent(
            response.message
          )}&status=${encodeURIComponent(response.statusCode)}`
    );
  } catch (error: any) {
    // console.error("Registration failed:", error);
    return redirect(
      `/dashboard/renter/update-renter/${renterId}?error=${encodeURIComponent(
        error.message || "An unexpected error occurred."
      )}&status=${encodeURIComponent(error.code)}`
    );
  }
};

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { renter } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed",
        description: `Unexpected ${error} with status code ${statusCode}`,
        variant: "destructive", // Default toast style
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, error, setSearchParams]);

  const fieldProps = [
    { id: "name", label: "Name", type: "text" },
    { id: "fatherName", label: "Father Name", type: "text" },
    { id: "motherName", label: "Mother Name", type: "text" },
    { id: "dateOfBirth", label: "Date Of Birth", type: "date" },
    { id: "occupation", label: "Occupation", type: "text" },
    { id: "religion", label: "Religion", type: "text" },
    { id: "education", label: "Education", type: "text" },
    { id: "phoneNumber", label: "Phone Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "passportNumber", label: "Passport Number", type: "text" },
    { id: "nidNumber", label: "NID Number", type: "text" },
    {
      id: "prevRoomOwnerName",
      label: "Previous Owner Name",
      type: "text",
    },
    {
      id: "prevRoomOwnerNumber",
      label: "previous Owner Number",
      type: "text",
    },
    {
      id: "prevRoomOwnerAddress",
      label: "Previous Owner Address",
      type: "text",
    },
    {
      id: "reasonToLeavePrevHome",
      label: "Reason To Leave Previous Home",
      type: "text",
    },
  ];
  interface FormData {
    name: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string; // or Date if using a Date object
    maritalStatus: string;
    occupation: string;
    religion: string;
    education: string;
    passportNumber: string;
    prevRoomOwnerName: string;
    prevRoomOwnerNumber: string;
    prevRoomOwnerAddress: string;
    reasonToLeavePrevHome: string;
    phoneNumber: string;
    nidNumber: string;
    email: string;
    address: string;
    active: string;
  }
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    name: renter.name || "",
    fatherName: renter.fatherName || "",
    motherName: renter.motherName || "",
    dateOfBirth: renter.dateOfBirth || "",
    maritalStatus: renter.maritalStatus || "",
    occupation: renter.occupation || "",
    religion: renter.religion || "",
    education: renter.education || "",
    passportNumber: renter.passportNumber || "",
    prevRoomOwnerName: renter.prevRoomOwnerName || "",
    prevRoomOwnerNumber: renter.prevRoomOwnerNumber || "",
    prevRoomOwnerAddress: renter.prevRoomOwnerAddress || "",
    reasonToLeavePrevHome: renter.reasonToLeavePrevHome || "",
    phoneNumber: renter.phoneNumber || "",
    nidNumber: renter.nidNumber || "",
    email: renter.email || "",
    address: renter.address || "",
    active: renter.active ? "1" : "0",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl">Update Renter Info</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-6"
          >
            <Input id="id" type="hidden" name="id" value={renter.id} />
            {fieldProps.map(({ id, label, type }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  value={formData[id as keyof FormData]}
                  onChange={handleChange}
                  type={type}
                  placeholder={label.toLowerCase()}
                  required={id == "passportNumber" ? false : true}
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={renter.address}
                name="address"
                placeholder="Address"
              />
            </div>

            {[
              { id: "imageUrl", label: "Renter Image" },
              { id: "nidImageUrl", label: "NID Picture" },
            ].map(({ id, label }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} name={id} type="file" />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                name="maritalStatus"
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, maritalStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="unmarried">Unmarried</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="active">Active Status</Label>
              <Select
                name="active"
                value={formData.active}
                onValueChange={(value) =>
                  setFormData({ ...formData, active: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select active status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
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
                  title: "Create cancelled",
                });
                navigate(`/dashboard/renter`);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;

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
