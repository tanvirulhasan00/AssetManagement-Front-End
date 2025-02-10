import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { DeleteRange, GetAllCategory } from "~/components/data";
import { toast } from "~/hooks/use-toast";
import { Separator } from "~/components/ui/separator";
import { authCookie } from "~/cookies.server";

export type Category = {
  id: number;
  name: string;
  price: string;
  active: number;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const response = await GetAllCategory(token);
  const data = response.result;
  return { data, token };
};

import { columns } from "../components/category-columns";
import { DataTable } from "~/components/custom-data-table/data-table";
import { PlusCircle } from "lucide-react";

const CategoryDataTable = () => {
  const { data, token } = useLoaderData<typeof loader>();

  const handleDelete = async (selectedIds: string[]) => {
    console.log("d", selectedIds);
    await DeleteRange(selectedIds, token, "category");
    location.reload();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1>Category List</h1>
        <Button>
          <Link
            to={`/dashboard/category/create-category/`}
            className="flex items-center gap-1"
          >
            <PlusCircle />
            Add Category
          </Link>
        </Button>
      </div>
      <Separator className="mt-4" />
      <DataTable columns={columns} data={data} onDelete={handleDelete} />
    </div>
  );
};

export default CategoryDataTable;

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
