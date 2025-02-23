import { ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BarChartComp } from "~/components/bar-chat";
import { GetAll } from "~/components/data";
import { PaiChartComp } from "~/components/pai-chart";
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
  const emptyFlats = flats.result.filter(
    (flat: any) => flat.assignedId === null || flat.assignedId === ""
  );
  return { houses, flats, renters, emptyFlats };
};

const Home = () => {
  const { houses, flats, renters, emptyFlats } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full gap-3 items-center ">
        <Card className="w-full h-[13rem]">
          <CardHeader>
            <CardTitle>Houses Summary</CardTitle>
          </CardHeader>
          <CardContent>
            Total Houses:
            <span className="text-orange-500"> {houses.result.length}</span>
          </CardContent>
          <CardContent>
            Total Flats:
            <span className="text-orange-500"> {flats.result.length}</span>
          </CardContent>
          <CardContent>
            Empty Flats:
            <span className="text-orange-500"> {emptyFlats.length}</span>
          </CardContent>
        </Card>
        <Card className="w-full h-[13rem]">
          <CardHeader>
            <CardTitle>Renters Summary</CardTitle>
          </CardHeader>
          <CardContent>
            Total Renters:
            <span className="text-orange-500"> {renters.result.length}</span>
          </CardContent>
        </Card>
        <Card className="w-full h-[13rem]">
          <ScrollArea className="w-full h-full">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              Total Rent Amounts:
              <span className="text-orange-500"> {renters.result.length}</span>
            </CardContent>
            <CardContent>
              Total Collectable Rent Amounts:
              <span className="text-orange-500"> {renters.result.length}</span>
            </CardContent>
            <CardContent>
              Total Collected Rent Amounts:
              <span className="text-orange-500"> {renters.result.length}</span>
            </CardContent>
            <CardContent>
              Total Due Rent Amounts:
              <span className="text-orange-500"> {renters.result.length}</span>
            </CardContent>
          </ScrollArea>
        </Card>
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
