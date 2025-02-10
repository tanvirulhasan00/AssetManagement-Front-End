import { ModeToggle } from "~/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import {
  isRouteErrorResponse,
  Outlet,
  redirect,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Separator } from "~/components/ui/separator";
import { authCookie, userIdCookie } from "~/cookies.server";
import { useEffect, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Toaster } from "~/components/ui/toaster";
import { toast } from "~/hooks/use-toast";
import { GetUser } from "~/components/data";

export const action = async () => {
  return redirect("/", {
    headers: {
      "Set-Cookie": [
        await authCookie.serialize("", { maxAge: 0 }), // Clear auth token
        await userIdCookie.serialize("", { maxAge: 0 }), // Clear user ID
      ].join(", "),
    },
  });
};

// Loader for redirection to /dashboard/home
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // If the current route is /dashboard, redirect to /dashboard/home
  const url = new URL(request.url);
  if (url.pathname === "/dashboard" || url.pathname === "/dashboard/") {
    return redirect("/dashboard/home");
  }
  const cookieHeader = request.headers.get("Cookie");
  const cookieUserId = request.headers.get("Cookie");
  const cookie = (await authCookie.parse(cookieHeader)) || null;
  const userId = (await userIdCookie.parse(cookieUserId)) || null;
  const user = await GetUser(userId, cookie);

  return { token: cookie, user: user }; // No redirect if we're already at /dashboard/home or deeper
};

const DashboardLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (statusCode == "200" && message) {
      toast({
        title: "Success",
        description: `${message}`,
        variant: "default", // Default toast style
      });
    }
    if (statusCode == "201" && message) {
      toast({
        title: "Success",
        description: `${message}`,
        variant: "default", // Default toast style
      });
    }
    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarProvider>
      <AppSidebar openB={isSidebarOpen} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center px-6">
            <SidebarTrigger className="-ml-1" onClick={toggleSidebar} />
            <ModeToggle />
          </div>
        </header>
        <Separator />
        <div className="p-4">
          <Outlet />
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

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
