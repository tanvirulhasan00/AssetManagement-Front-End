import { LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { GetRenter } from "~/components/data";
import { Button } from "~/components/ui/button";
import { authCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { renterId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  const response = await GetRenter(Number(renterId), token);
  const renter = await response.result;

  return { renter };
};

const RenterProfile = () => {
  const { renter } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const message = searchParams.get("message");
  const statusCode = searchParams.get("status");
  const error = searchParams.get("error");

  useEffect(() => {
    if (statusCode == "200" && message) {
      toast({
        title: "Success",
        description: `${message}`,
        variant: "default",
      });
    }
    if (error) {
      toast({
        title: "Error",
        description: `${error} with status code ${statusCode}`,
        variant: "destructive",
      });
    }
    // ✅ Remove query params AFTER toast is shown
    if (message || error) {
      setTimeout(() => setSearchParams({}, { replace: true }), 1000);
    }
  }, [statusCode, message, error, setSearchParams]);

  const handleClick = () => {
    navigate("/dashboard/renter");
    // navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Cover Photo */}
      <div className="w-full h-72 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        <img
          src={renter.imageUrl}
          alt="renter-image"
          className="w-full h-full object-cover relative"
        />
        <Button
          className=" absolute top-1 left-1 bg-inherit"
          onClick={handleClick}
        >
          <ArrowLeft />
          Go Back
        </Button>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={renter.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10 p-6 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {renter.name}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">@{renter.name}</p>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
            <Link to={`/dashboard/renter/update-renter/${renter.id}`}>
              Update info
            </Link>
          </button>
          <Button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition">
            Other
          </Button>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mt-6 ">
        {/* About Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Address
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 ">
              {renter.address}
            </p>
          </div>

          {/* Room info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Room Informations
            </h3>
            <div className="mt-4">Two Factor Auth: </div>
            <div className="mt-4">Phone Number Confirmed: </div>
            <div className="mt-4">Email Confirmed:</div>
          </div>
          {/* Emergency contact Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Emergency contacts
            </h3>
            <div className="mt-4">Two Factor Auth: </div>
            <div className="mt-4">Phone Number Confirmed: </div>
            <div className="mt-4">Email Confirmed:</div>
          </div>
          {/* Family member Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Family Members
            </h3>
            <div className="mt-4">Two Factor Auth: </div>
            <div className="mt-4">Phone Number Confirmed: </div>
            <div className="mt-4">Email Confirmed:</div>
          </div>

          {/* Posts Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Renter Information
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Father Name: {renter.fatherName}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Mother Name: {renter.motherName}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Nid Number: {renter.nidNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Mobile: {renter.phoneNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Date Of Birth: {renter.dateOfBirth}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Email: {renter.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Marital Status: {renter.maritalStatus}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Occupation: {renter.occupation}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Education: {renter.education}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Religion: {renter.religion}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Passport Number: {renter.passportNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 w-">
              Created Date: {renter.createdDate}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            National Id
          </h3>
          <div className="mt-4 flex space-x-0">
            <img
              src={renter.nidImageUrl}
              alt="Nid"
              className="w-full h-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterProfile;

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
