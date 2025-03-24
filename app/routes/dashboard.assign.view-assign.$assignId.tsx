import {
  Link,
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from "react-router";
import { BdtCurrencyFormate } from "~/components/bdt-currency";
import { Get, GetAssign } from "~/components/data";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { authCookie } from "~/cookies.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { assignId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const formPayload = new FormData();
  formPayload.append("assignId", assignId as string);
  const response = await GetAssign(formPayload, token);
  const monthlyStatusRes = await Get(
    Number(assignId),
    token,
    "monthly-payment-status"
  );

  const assign = response.result;
  const monthlyStatus = monthlyStatusRes.result;
  const flatRes = await Get(Number(assign?.flat?.id), token, "flat");
  const flat = flatRes.result;
  return { assign, monthlyStatus, flat };
};

const ViewAssign = () => {
  const { assign, monthlyStatus, flat } = useLoaderData<typeof loader>();
  console.log(assign);
  const navigate = useNavigate();
  return (
    <div>
      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Assign Informations
          </CardTitle>
          <Separator className="my-5" />
        </CardHeader>
        <CardContent className="h-full">
          <div className="flex justify-between items-center ">
            <p>
              Assign ID: <span className="text-green-600">{assign.id}</span>
            </p>
            <p>
              Reference Number:{" "}
              <span className="text-green-600">{assign.referenceNo}</span>
            </p>
            <p>
              Flat Rent:{" "}
              <span className="text-green-600">
                {BdtCurrencyFormate(assign.flatRent)}
              </span>
            </p>
            <p>
              Active Status:{" "}
              <span className="text-green-600">
                {assign.active === 1 ? "Active" : "InActive"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-5 my-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Renter Informations</CardTitle>
            <Separator className="my-5" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 justify-between gap-3">
            <div className="grid gap-1">
              <h1>
                Name:{" "}
                <span className="text-green-600">{assign?.renter?.name}</span>
              </h1>
              <h1>
                Phone Number:{" "}
                <span className="text-green-600">
                  {assign?.renter?.phoneNumber}
                </span>
              </h1>
            </div>
            <div className="flex justify-end">
              <img
                src={assign?.renter?.imageUrl}
                alt="renter_image"
                className="w-[5rem] rounded-md"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Link
              to={`/dashboard/renter/${assign?.renter?.id}`}
              className="hover:underline text-green-400 hover:text-green-600"
            >
              details &rarr;
            </Link>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Flat Informations</CardTitle>
            <Separator className="my-5" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <h1>
              Flat No: <span className="text-green-600">{flat.name}</span>
            </h1>
            <h1>
              House Name:{" "}
              <span className="text-green-600">{flat?.house?.name}</span>
            </h1>
            <h1>
              Flat Category:{" "}
              <span className="text-green-600">{flat?.category?.name}</span>
            </h1>
            <h1>
              Floor No: <span className="text-green-600">{flat.floorNo}</span>
            </h1>
            <h1>
              Total Room:{" "}
              <span className="text-green-600">{flat.totalRoom}</span>
            </h1>
            <h1
              className={`${
                flat.flatAdvance > 0 ? "" : "line-through text-red-700"
              }`}
            >
              Flat Advance:{" "}
              <span className="text-orange-600">
                {BdtCurrencyFormate(flat.flatAdvance)}
              </span>
            </h1>
            <h1>
              Flat Status:{" "}
              <span className="text-green-600">
                {flat.active === 1 ? "Active" : "InActive"}
              </span>
            </h1>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Payment Informations
          </CardTitle>
          <Separator className="my-5" />
        </CardHeader>
        <CardContent className="h-full">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <h1
                className={`${
                  flat.flatAdvance > 0 ? "" : "line-through text-red-700"
                }`}
              >
                Flat Advance Amount (Given):{" "}
                <span className="text-orange-600">
                  {BdtCurrencyFormate(flat.flatAdvance)}
                </span>
              </h1>
              <h1>
                Total Rent Due:{" "}
                <span className="text-green-600">
                  {BdtCurrencyFormate(assign.dueRent)}
                </span>
              </h1>
              <h1>
                Total Rent Advance:{" "}
                <span className="text-green-600">
                  {BdtCurrencyFormate(assign.advanceRent)}
                </span>
              </h1>
            </div>
            <div className="grid gap-3">
              {/* <Link to={"/dashboard/payment/create-payment"}> */}
              <Button
                onClick={() =>
                  navigate(`/dashboard/payment/rent-payment/${assign.id}`)
                }
                className="bg-green-400 hover:bg-green-500 cursor-pointer w-full"
              >
                Pay Rent
              </Button>
              {/* </Link> */}
              <Button
                disabled={assign.dueRent > 0 ? false : true}
                onClick={() =>
                  navigate(`/dashboard/payment/due-payment/${assign.id}`)
                }
                className="bg-orange-400 hover:bg-orange-500 cursor-pointer w-full"
              >
                Pay Due Rent
              </Button>
            </div>
          </div>
          <Separator className="my-5" />
          <div>
            <h1 className="mb-5 text-lg">
              Monthly Payment Status -{" "}
              <span className="text-green-600">{monthlyStatus.year}</span>
            </h1>
            <div className="grid grid-cols-4 gap-3 items-center ">
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <div key={index} className="grid grid-cols-2">
                  <h1 className="text-xl">{month}: </h1>
                  <Badge
                    className={`${
                      monthlyStatus[month.toLowerCase()] === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    } grid items-center justify-center`}
                  >
                    {monthlyStatus[month.toLowerCase()] ? (
                      monthlyStatus[month.toLowerCase()].toUpperCase()
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAssign;
