import { Landmark } from "lucide-react";

import LoginForm from "./login-form";
import { Link, useSearchParams } from "react-router";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import { authCookie, userIdCookie } from "~/cookies.server";
import { ModeToggle } from "~/components/mode-toggle";
import { Login } from "~/components/data";
import { toast } from "~/hooks/use-toast";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await authCookie.parse(cookieHeader)) || null;
  console.log("token", cookie);

  if (cookie !== null) {
    return redirect("/dashboard");
  }
  return { token: cookie };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const res = await Login(username, password);
  // const { user, token } = await res.result;

  // console.log("login", user);

  if (res.success) {
    return redirect(
      `/dashboard/home?message=${res.message}&status=${res.statusCode}`,
      {
        headers: {
          "Set-Cookie": [
            await authCookie.serialize(res.result.token),
            await userIdCookie.serialize(res.result.user.id),
          ].join(", "),
        },
      }
    );
  } else {
    return redirect(`/login?error=${res.message}&status=${res.statusCode}`);
  }
};

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        title: `Error code : ${statusCode}`,
        description: `${error}`,
        variant: "destructive",
      });
    }

    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-start gap-2">
          <Link to="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Landmark className="size-4" />
            </div>
            Asset Management
          </Link>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/asset.jpg"
          alt="Image-alt"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;
