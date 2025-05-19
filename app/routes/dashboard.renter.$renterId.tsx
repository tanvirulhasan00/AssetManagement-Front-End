import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
  LoaderFunctionArgs,
} from "react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Get, GetAssign, GetAllFamilyMember } from "~/components/data";
import { Button } from "~/components/ui/button";
import { authCookie } from "~/cookies.server";
import { toast } from "~/hooks/use-toast";
import { BdtCurrencyFormate } from "~/components/bdt-currency";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Card } from "~/components/ui/card";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { renterId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;

  const response = await Get(Number(renterId), token, "renter");
  const formPayload = new FormData();
  const formPayload2 = new FormData();
  formPayload.append("renterId", renterId as string);
  formPayload2.append("renterId", renterId as string);
  formPayload2.append("familyMember", "0");
  const resFamilyMember = await GetAllFamilyMember(formPayload2, token);
  const resAssign = await GetAssign(formPayload, token);
  const renter = await response.result;
  const assign = await resAssign.result;
  const familyMember = await resFamilyMember.result;
  // console.log("gd1", assign);
  console.log("gd2", familyMember);

  return { renter, assign, familyMember };
};

const RenterProfile = () => {
  const { renter, assign, familyMember } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const emergencyContact = familyMember.filter(
    (x: any) => x.isEmergencyContact == 1
  );
  console.log("g", emergencyContact.length);
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
      <div className="w-full h-72 bg-linear-to-r from-indigo-500 to-purple-600 relative">
        <img
          src={renter.imageUrl}
          alt="renter-image"
          className="w-full h-full object-cover relative"
        />
        <Button
          className=" absolute top-1 left-1 bg-inherit border-2 border-white cursor-pointer"
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
          <Button
            disabled={assign && assign?.id != 0 ? false : true}
            onClick={() =>
              navigate(`/dashboard/assign/view-assign/${assign?.id}`)
            }
            className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
          >
            Assign Info
          </Button>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mt-6 ">
        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Address
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 ">
              {renter.address ? renter.address : "No Data"}
            </p>
          </div>

          {/* Room info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Room Informations
            </h3>
            <div className="mt-4">
              Ref No:{" "}
              <span className="text-orange-600">
                {assign?.referenceNo ? assign?.referenceNo : "No Data"}
              </span>
            </div>

            <div className="mt-4">
              Flat Number:{" "}
              <span className="text-orange-600">
                {assign?.flat?.name ? assign?.flat?.name : "No Data"}
              </span>{" "}
            </div>
            <div className="mt-4">
              Flat Price:{" "}
              <span className="text-orange-600">
                {BdtCurrencyFormate(assign?.flatRent)}
              </span>
            </div>
          </div>
          {/* Emergency contact Section */}
          <div className=" bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Emergency contacts
            </h3>
            {emergencyContact && emergencyContact.length > 0 ? (
              <ScrollArea className="w-full h-[15rem] ">
                {emergencyContact.map((contact: any, index: any) => (
                  <Card
                    key={index}
                    className="grid grid-cols-2 mt-3 justify-between items-center bg-gray-700 p-2 "
                  >
                    <div className="grid gap-2">
                      <div className="">
                        Relation:{" "}
                        <span className="text-orange-600">
                          {contact.relation}
                        </span>{" "}
                      </div>
                      <div className="">
                        Name:
                        <span className="text-orange-600">
                          {contact.name}
                        </span>{" "}
                      </div>
                      <div className="">
                        Mobile:{" "}
                        <span className="text-orange-600">
                          {contact.phoneNumber}
                        </span>{" "}
                      </div>
                      <div className="">
                        Nid Number:{" "}
                        <span className="text-orange-600">
                          {contact.nidNumber}
                        </span>{" "}
                      </div>
                    </div>
                    <div className="w-full rounded-lg grid justify-end">
                      <img
                        className="w-[4rem] rounded-lg"
                        src={contact.imageUrl}
                        alt=""
                      />
                    </div>
                  </Card>
                ))}
              </ScrollArea>
            ) : (
              <div className="grid items-center justify-center">
                <h1 className="text-orange-600">No Data</h1>
              </div>
            )}
          </div>
          {/* Family member Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Family Members
            </h3>
            {familyMember && familyMember.length > 0 ? (
              <ScrollArea className="w-full h-[15rem] ">
                {familyMember.map((member: any, index: any) => (
                  <Card
                    key={index}
                    className="bg-gray-700 grid grid-cols-2 items-center  gap-2 mb-2 p-2 rounded-lg mt-3"
                  >
                    <div className="grid gap-2">
                      <div>
                        Relation:{" "}
                        <span className="text-orange-600">
                          {member.relation}
                        </span>{" "}
                      </div>
                      <div className="">
                        Name:{" "}
                        <span className="text-orange-600">{member.name}</span>{" "}
                      </div>
                      <div className="">
                        Mobile:{" "}
                        <span className="text-orange-600">
                          {member.phoneNumber}
                        </span>{" "}
                      </div>
                    </div>
                    <div className="w-full rounded-lg grid justify-end">
                      <img
                        className="w-[4rem] rounded-lg"
                        src={member.imageUrl}
                        alt=""
                      />
                    </div>
                  </Card>
                ))}
              </ScrollArea>
            ) : (
              <div className="grid items-center justify-center">
                <h1 className="text-orange-600">No Data</h1>
              </div>
            )}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-[55rem]">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white  h-[5%] flex items-center">
            National Id
          </h1>
          <div className="grid gap-2 h-[95%]">
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
