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
} from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetUser } from "~/components/data";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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

// Loader function to fetch user data
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { userId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const response = await GetUser(userId || "", token);
  const user = await response.result;

  return { user };
};

// Action function to update user
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("id") as string; // Retrieve ID
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  // Construct form payload
  const formPayload = new FormData();
  formPayload.append("id", userId); // Ensure ID is included
  formPayload.append("name", formData.get("name") as string);
  formPayload.append("username", formData.get("username") as string);
  formPayload.append("phonenumber", formData.get("phonenumber") as string);
  formPayload.append("nidnumber", formData.get("nidnumber") as string);
  formPayload.append("email", formData.get("email") as string);
  formPayload.append("address", formData.get("address") as string);
  formPayload.append("active", formData.get("active") as string);

  // Add files (if selected)
  const profilePic = formData.get("profilepicurl");
  const nidPic = formData.get("nidpicurl");

  if (profilePic instanceof File) {
    formPayload.append("profilepicurl", profilePic);
  }
  if (nidPic instanceof File) {
    formPayload.append("nidpicurl", nidPic);
  }
  console.log("edit-profile", formPayload);
  // Send request
  try {
    const response = await axios.post(
      "http://localhost:5233/api/v1/user/update",
      formPayload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token here
        },
      }
    );

    if (response.data.success) {
      return redirect(
        `/dashboard/users/${userId}?message=${response.data.message}&status=${response.data.statusCode}`
      );
    }
  } catch (error: any) {
    return redirect(
      `/dashboard/edit-profile/${userId}?error=${encodeURIComponent(
        error.message
      )}&status=${error.code}`
    );
  }
};

const UserEditProfile = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    userid: user.id || "",
    name: user.name || "",
    username: user.userName || "",
    phonenumber: user.phoneNumber || "",
    nidnumber: user.nidNumber || "",
    email: user.email || "",
    address: user.address || "",
    active: user.active ? "1" : "0",
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
        <CardHeader>
          <CardTitle className="text-2xl">Update</CardTitle>
          <CardDescription>Update user information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" encType="multipart/form-data">
            {/* Hidden input to pass user ID */}
            <input hidden name="id" value={user.id} />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phonenumber">Phone Number</Label>
                <Input
                  id="phonenumber"
                  name="phonenumber"
                  type="text"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nidnumber">Nid Number</Label>
                <Input
                  id="nidnumber"
                  name="nidnumber"
                  type="text"
                  value={formData.nidnumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profilepicurl">Profile Picture</Label>
                <Input id="profilepicurl" name="profilepicurl" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nidpicurl">Nid Picture</Label>
                <Input id="nidpicurl" name="nidpicurl" type="file" />
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
                  <SelectTrigger id="active">
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
                    title: "Update cancelled",
                  });
                  navigate(`/dashboard/users/${formData.userid}`);
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

export default UserEditProfile;

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
