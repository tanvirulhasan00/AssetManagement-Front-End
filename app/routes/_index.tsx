import { redirect, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { authCookie, userIdCookie } from "~/cookies.server";
import DashboardLayout from "./dashboard/route";
import { ErrorBoundary } from "~/error-boundary";
import { isRouteErrorResponse, useRouteError } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Asset Management" },
    {
      name: "description",
      content: "Welcome to Asset Manangement Application!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await authCookie.parse(cookieHeader)) || null;

  if (!cookie) {
    return redirect("/login");
  }

  const url = new URL(request.url);

  // Redirect from / to /dashboard/home
  if (url.pathname === "/") {
    return redirect("/dashboard/home");
  }

  return null;
};

export const action = async () => {
  console.log("logout");
  return redirect("/", {
    headers: {
      "Set-Cookie": [
        await authCookie.serialize("", { maxAge: 0 }), // Clear auth token
        await userIdCookie.serialize("", { maxAge: 0 }), // Clear user ID
      ].join(", "),
    },
  });
};

export default function Index() {
  return <DashboardLayout />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
