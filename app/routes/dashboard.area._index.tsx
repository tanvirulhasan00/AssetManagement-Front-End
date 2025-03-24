import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigation,
  useRouteError,
  LoaderFunctionArgs,
} from "react-router";
import { DeleteRange, GetAll } from "~/components/data";
import { toast } from "~/hooks/use-toast";
import { Separator } from "~/components/ui/separator";
import { authCookie } from "~/cookies.server";
import { DataTable } from "~/components/custom-data-table/data-table";
import { columns } from "~/components/area-columns";
import { PlusCircle } from "lucide-react";
// import type { Route } from "./+types/";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const response = await GetAll(token, "area");
  const data = response.result;
  return { data, token };
};

const AreaDataTable = () => {
  const { data, token } = useLoaderData<typeof loader>();

  const handleDelete = async (selectedIds: string[]) => {
    try {
      const res = await DeleteRange(selectedIds, token, "area");
      if (res.success === true) {
        toast({
          title: res.statusCode,
          description: res.message,
          variant: "default",
          // action: (
          //   <button
          //     onClick={() => location.reload()}
          //     className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          //   >
          //     OK
          //   </button>
          // ),
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
      toast({
        title: error.code,
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? <div>Loading...</div> : null;
  }, [navigation]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1>Area List</h1>
        <Button>
          <Link
            to={`/dashboard/area/create-area/`}
            className="flex items-center gap-1"
          >
            <PlusCircle />
            Add Area
          </Link>
        </Button>
      </div>
      <Separator className="mt-4" />
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
        btnName="Delete"
        filterWith="name"
      />
    </div>
  );
};

export default AreaDataTable;

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
