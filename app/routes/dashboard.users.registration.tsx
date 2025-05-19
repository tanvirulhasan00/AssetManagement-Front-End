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
  ActionFunctionArgs,
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { toast } from "~/hooks/use-toast";
import { authCookie } from "~/cookies.server";
import { UserRegistration } from "~/components/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const token = (await authCookie.parse(cookieHeader)) || null;

    // Extract fields safely
    const fields = [
      "name",
      "username",
      "password",
      "phonenumber",
      "nidnumber",
      "email",
      "address",
      "active",
    ];

    const data: Record<string, string> = {};
    for (const field of fields) {
      const value = formData.get(field);
      if (!value) {
        return redirect(
          `/dashboard/registration?error=${encodeURIComponent(
            `${field} is required`
          )}`
        );
      }
      data[field] = value.toString();
    }

    // Extract files separately
    const profilepicurl = formData.get("profilepicurl");
    const nidpicurl = formData.get("nidpicurl");

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}$/;
    if (!passwordRegex.test(data.password)) {
      return redirect(
        `/dashboard/registration?error=${encodeURIComponent(
          "Password must be at least 6 characters long, include at least one uppercase letter, one digit, and one special character."
        )}`
      );
    }

    // Prepare FormData for API request
    const formPayload = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formPayload.append(key, value)
    );

    if (profilepicurl instanceof File)
      formPayload.append("profilepicurl", profilepicurl);
    if (nidpicurl instanceof File) formPayload.append("nidpicurl", nidpicurl);

    console.log(
      "Submitting registration:",
      Object.fromEntries(formPayload.entries())
    );

    // Send API request
    const response = await UserRegistration(formPayload, token);

    const { success, message, statusCode } = response;

    return redirect(
      success
        ? `/dashboard/users?status=${encodeURIComponent(
            statusCode
          )}&message=${encodeURIComponent(message)}`
        : `/dashboard/users/registration?error=${encodeURIComponent(
            message
          )}&status=${encodeURIComponent(statusCode)}`
    );
  } catch (error: any) {
    console.error("Registration failed:", error);
    return redirect(
      `/dashboard/users/registration?error=${encodeURIComponent(
        error.message || "An unexpected error occurred."
      )}&status=${error.code}`
    );
  }
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}$/;

const RegistrationForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isValidPass = passwordRegex.test(password);

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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-2xl">Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-6"
          >
            {[
              { id: "name", label: "Name", type: "text" },
              { id: "username", label: "User Name", type: "text" },
              { id: "phonenumber", label: "Phone Number", type: "text" },
              { id: "nidnumber", label: "NID Number", type: "text" },
              { id: "email", label: "Email", type: "email" },
            ].map(({ id, label, type }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={label.toLowerCase()}
                  required
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <div
                  className={`flex items-center gap-1 text-${
                    isValidPass ? "green" : "red"
                  }-500`}
                >
                  {isValidPass ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <p className="text-sm">
                    {isValidPass ? "Valid password" : "Invalid password"}
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" placeholder="Address" />
            </div>

            {[
              { id: "profilepicurl", label: "Profile Picture" },
              { id: "nidpicurl", label: "NID Picture" },
            ].map(({ id, label }) => (
              <div key={id} className="grid gap-2">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} name={id} type="file" required />
              </div>
            ))}

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
                navigate(`/dashboard/users`);
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
