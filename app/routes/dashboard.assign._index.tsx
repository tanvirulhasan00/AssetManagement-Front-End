import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { GetAll, MakeInAcatived } from "~/components/data";
import { toast } from "~/hooks/use-toast";
import { Separator } from "~/components/ui/separator";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authCookie } from "~/cookies.server";
import { DataTable } from "~/components/custom-data-table/data-table";
import { columns } from "~/components/assign-columns";
import { PlusCircle } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const response = await GetAll(token, "assign");
  const data = response.result;

  return { data, token };
};

const AssignDataTable = () => {
  const { data, token } = useLoaderData<typeof loader>();

  const handleActiveStatus = async (selectedIds: string[]) => {
    try {
      const res = await MakeInAcatived(selectedIds, token, "assign");
      if (res.success === true) {
        toast({
          title: res.statusCode,
          description: res.message,
          variant: "default",
        });
        location.reload();
      } else {
        toast({
          title: res.statusCode,
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log("g", error);
      toast({
        title: error.code,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1>Assigned List</h1>
        <Button>
          <Link
            to={`/dashboard/assign/create-assign/`}
            className="flex items-center gap-1"
          >
            <PlusCircle />
            Assign Renter
          </Link>
        </Button>
      </div>
      <Separator className="mt-4" />
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleActiveStatus}
        btnName="InActive"
        filterWith="referenceNo"
      />
    </div>
  );
};

export default AssignDataTable;

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
