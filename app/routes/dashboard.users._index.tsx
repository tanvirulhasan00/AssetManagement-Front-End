import { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { DataTable } from "~/components/custom-data-table/data-table";
import { DeleteRange, GetAll, GetAllUser } from "~/components/data";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { columns } from "~/components/user-columns";
import { authCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const response = await GetAll(token, "user");
  const data = await response.result;
  return { data, token };
};

const Users = () => {
  const { data, token } = useLoaderData<typeof loader>();

  const handleDelete = async (selectedIds: string[]) => {
    try {
      await DeleteRange(selectedIds, token, "user");
      location.reload();
    } catch (error: any) {
      toast({
        title: error.code,
        description: error.message,
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>User List</h1>
        <Button>
          <Link
            to={"/dashboard/users/registration"}
            className="flex items-center gap-1"
          >
            <PlusCircle />
            Add User
          </Link>
        </Button>
      </div>
      <Separator className="mt-4" />
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
        filterWith="name"
      />
    </div>
  );
};

export default Users;

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
