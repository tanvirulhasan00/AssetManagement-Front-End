import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  isRouteErrorResponse,
  redirect,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
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
import { useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ActionFunctionArgs } from "@remix-run/node";
import { toast } from "~/hooks/use-toast";
import { authCookie } from "~/cookies.server";
import { CreateRenter, Renter } from "~/components/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const token = (await authCookie.parse(cookieHeader)) || null;

    // Extract fields safely
    const fields = [
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
    const response = await CreateRenter(formPayload, token);

    return redirect(
      response.success
        ? `/dashboard/renter?status=${encodeURIComponent(
            response.statusCode
          )}&message=${encodeURIComponent(response.message)}`
        : `/dashboard/renter/registration?error=${encodeURIComponent(
            response.message
          )}&status=${encodeURIComponent(response.statusCode)}`
    );
  } catch (error: any) {
    console.error("Registration failed:", error);
    return redirect(
      `/dashboard/renter/registration?error=${encodeURIComponent(
        error.message || "An unexpected error occurred."
      )}&status=${encodeURIComponent(error.code)}`
    );
  }
};

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed",
        description: `Registration ${error} with status code ${statusCode}`,
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
    { id: "startDate", label: "Start Date", type: "date" },
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl">Renter Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-6"
          >
            {fieldProps.map(({ id, label, type }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={label.toLowerCase()}
                  required={id == "passportNumber" ? false : true}
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" placeholder="Address" />
            </div>

            {[
              { id: "imageUrl", label: "Renter Image" },
              { id: "nidImageUrl", label: "NID Picture" },
            ].map(({ id, label }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} name={id} type="file" required />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select name="maritalStatus">
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
              <Select name="active">
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
              Register
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
