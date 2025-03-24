import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import SignUpForm from "./sign-up-form";
import axios from "axios";
import { useLoaderData } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, CircleCheck } from "lucide-react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const username = formData.get("username");
  const password = formData.get("password") as string;
  const phonenumber = formData.get("phonenumber");
  const nidnumber = formData.get("nidnumber");
  const email = formData.get("email");
  const address = formData.get("address");
  const profilepicurl = formData.get("profilepicurl");
  const nidpicurl = formData.get("nidpicurl");
  const activeStatus = formData.get("active");

  const regex = /^(?=(.*[A-Z]))(?=(.*\d))(?=(.*\W))(?=.{6,})[A-Za-z\d\W]*$/;
  if (regex.test(password)) {
    try {
      // Prepare FormData for multipart/form-data
      const formPayload = new FormData();
      formPayload.append("name", name as string);
      formPayload.append("username", username as string);
      formPayload.append("password", password as string);
      formPayload.append("phonenumber", phonenumber as string);
      formPayload.append("nidnumber", nidnumber as string);
      formPayload.append("email", email as string);
      formPayload.append("address", address as string);
      formPayload.append("active", activeStatus as string);

      // Add files
      if (profilepicurl instanceof File) {
        formPayload.append("profilepicurl", profilepicurl);
      }
      if (nidpicurl instanceof File) {
        formPayload.append("nidpicurl", nidpicurl);
      }
      console.log("from action", formPayload);
      // Send POST request
      const response = await axios.post(
        "http://localhost:5233/api/v1/auth/registration",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authToken}`, // Include token here
          },
        }
      );

      if (response.data.success) {
        const message = response.data.message;
        const statusCode = response.data.statusCode;
        return redirect(
          `/sign-up?statusCode=${encodeURIComponent(
            statusCode
          )}&message=${encodeURIComponent(message)}`
        );
      } else {
        const error = response.data.message;
        const statusCode = response.data.statusCode;
        return redirect(
          `/sign-up?error=${encodeURIComponent(
            error
          )}&statusCode=${encodeURIComponent(statusCode)}`
        );
      }
    } catch (error: any) {
      const errorMsg = `${
        !error.message
          ? "Some error occurs. please check your inputs"
          : error.message
      } `;
      return redirect(`/sign-up?error=${encodeURIComponent(errorMsg)}`);
    }
  } else {
    const message =
      "Password must be at least 6 characters long, include at least one uppercase letter, one digit, and one non-alphanumeric character.";
    return redirect(`/sign-up?error=${encodeURIComponent(message)}`);
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const message = url.searchParams.get("message");
  const error = url.searchParams.get("error");
  const statusCode = url.searchParams.get("statusCode");
  return { message, error, statusCode };
};

const SignUpRoute = () => {
  const { message, error, statusCode } = useLoaderData<typeof loader>();
  console.log("dd", message, error);
  //const location = useLocation();
  //const errorMessage = new URLSearchParams(location.search).get("error");
  //const success = new URLSearchParams(location.search).get("success");

  return (
    <div className="flex flex-col w-full items-center justify-center p-6 md:p-10">
      <div className="w-[60%]">
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{statusCode}</p>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="mb-2 border-green-500">
            <CircleCheck className="h-4 w-4" color="#22c55e" />
            <AlertTitle>Successful</AlertTitle>
            <AlertDescription>
              <p>{statusCode}</p>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpRoute;
