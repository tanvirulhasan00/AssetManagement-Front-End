import React, { useState } from "react";
import { ActionFunctionArgs, useLoaderData } from "react-router";
import { BarChartComp } from "~/components/bar-chat";
import { BdtCurrencyFormate } from "~/components/bdt-currency";
import { GetAll } from "~/components/data";
import { PaiChartComp } from "~/components/pai-chart";
import SelectMonth from "~/components/select-month";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { authCookie } from "~/cookies.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await authCookie.parse(cookieHeader)) || null;
  const houses = await GetAll(token, "house");
  const flats = await GetAll(token, "flat");
  const renters = await GetAll(token, "renter");
  const assigns = await GetAll(token, "assign");
  const payments = await GetAll(token, "payment");
  const emptyFlats = flats.result.filter(
    (flat: any) => flat.assignedId === null || flat.assignedId === ""
  );
  return { houses, flats, renters, emptyFlats, assigns, payments };
};

const Home = () => {
  const { houses, flats, renters, emptyFlats, assigns, payments } =
    useLoaderData<typeof loader>();

  const totalRent = flats?.result?.reduce(
    (sum, flat) => sum + (flat?.category.price || 0),
    0
  );
  const totalCollectableRent = assigns?.result?.reduce(
    (sum, assign) => sum + (assign.flatRent || 0),
    0
  );
  const totalDueRent = assigns?.result?.reduce(
    (sum, assign) => sum + (assign.dueRent || 0),
    0
  );
  const filterRent = payments?.result.filter((x) => x.paymentType == "rent");
  const filterDueRent = payments?.result.filter(
    (x) => x.paymentType == "duerent"
  );
  const totalCollectedRent = filterRent.reduce(
    (sum, payment) => sum + (payment.paymentAmount || 0),
    0
  );
  const totalCollectedDueRent = filterDueRent.reduce(
    (sum, payment) => sum + (payment.paymentAmount || 0),
    0
  );

  // monthly
  const [month, setMonth] = useState<string | null>(null);
  const filterRentMonthly = payments?.result.filter(
    (x) => x.paymentType == "rent" && x.paymentMonth == month
  );
  const filterDueRentMonthly = payments?.result.filter(
    (x) => x.paymentType == "duerent" && x.paymentMonth == month
  );
  const totalCollectedRentMonthly = filterRentMonthly.reduce(
    (sum, payment) => sum + (payment.paymentAmount || 0),
    0
  );
  const totalCollectedDueRentMonthly = filterDueRentMonthly.reduce(
    (sum, payment) => sum + (payment.paymentAmount || 0),
    0
  );

  return (
    <div className="flex flex-col w-full p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-2 items-center ">
        <Card className="w-full h-[15rem] overflow-hidden ">
          <CardHeader className="">
            <CardTitle className="text-xl">Houses Summary</CardTitle>
          </CardHeader>

          {/* <ScrollArea className="w-full md:h-[10rem]"> */}
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 md:grid-cols-2 items-center">
              <h1 className="">Total Houses:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {houses.result.length}
              </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-2 items-center">
              <h1 className="">Total Flats:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {flats.result.length}
              </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-2 items-center">
              <h1 className="">Empty Flats:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {emptyFlats.length}
              </span>
            </div>
          </CardContent>
          {/* </ScrollArea> */}
        </Card>
        <Card className="w-full h-[15rem]">
          <CardHeader>
            <CardTitle className="text-xl">Renters Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 md:grid-cols-2">
            <h1>Total Renters:</h1>
            <span className="text-green-500 text-xl font-bold">
              {" "}
              {renters.result.length}
            </span>
          </CardContent>
        </Card>
        <Card className="w-full h-[15rem]">
          <CardHeader>
            <CardTitle className="text-xl">Payment Summary</CardTitle>
          </CardHeader>
          <ScrollArea className="w-full h-[9.9rem]">
            <CardContent className="grid grid-cols-3 md:grid-cols-2">
              <h1>Total Rent Amounts:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {BdtCurrencyFormate(totalRent)}
              </span>
            </CardContent>
            <CardContent className="grid grid-cols-3 md:grid-cols-2">
              <h1>Total Collectable Rent Amounts:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {BdtCurrencyFormate(totalCollectableRent)}
              </span>
            </CardContent>
            <CardContent className="grid grid-cols-3 md:grid-cols-2 ">
              <h1>Total Collected Rent Amounts:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {BdtCurrencyFormate(totalCollectedRent)}
              </span>
            </CardContent>
            <CardContent className="grid grid-cols-3 md:grid-cols-2">
              <h1>Total Collected Due Rent Amounts:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {BdtCurrencyFormate(totalCollectedDueRent)}
              </span>
            </CardContent>
            <CardContent className="grid grid-cols-3 md:grid-cols-2">
              <h1>Total Due Rent Amounts:</h1>
              <span className="text-green-500 text-xl font-bold">
                {" "}
                {BdtCurrencyFormate(totalDueRent)}
              </span>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
      <Separator className="mt-5 mb-5" />
      <div>
        <div className="grid grid-cols-2 gap-4">
          <h1 className="text-2xl">Monthly Rent Collections</h1>
          <SelectMonth onChange={(month) => setMonth(month)} />
        </div>
        <div className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{month}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Card className="w-[30rem]">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 items-center  ">
                    <h1>Total Collectable Rent:</h1>
                    <span className="text-green-500 text-xl font-bold">
                      {" "}
                      {BdtCurrencyFormate(totalCollectableRent)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-[30rem]">
                <CardContent className=" p-3">
                  <div className="grid grid-cols-2 items-center  ">
                    <h1>Total Collected Rent:</h1>
                    <span className="text-green-500 text-xl font-bold">
                      {" "}
                      {BdtCurrencyFormate(totalCollectedRentMonthly)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-[30rem]">
                <CardContent className=" p-3">
                  <div className="grid grid-cols-2 items-center  ">
                    <h1>Total Collected Due Rent:</h1>
                    <span className="text-green-500 text-xl font-bold">
                      {" "}
                      {BdtCurrencyFormate(totalCollectedDueRentMonthly)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="mt-5 mb-5" />
      <div className="flex gap-4 w-full max-sm:flex-col">
        <PaiChartComp />
        <BarChartComp />
      </div>
      <Separator className="mt-5 mb-5" />
      <div className="w-full">
        <h1 className="flex justify-center w-full ">
          Created by <p>&nbsp;Logic Ninja</p>
        </h1>
      </div>
    </div>
  );
};

export default Home;
