import { BarChartComp } from "~/components/bar-chat";
import { DataTableDemo } from "~/components/data-table";
import { PaiChartComp } from "~/components/pai-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

const Home = () => {
  return (
    <div className="flex flex-col w-full p-4">
      <ScrollArea className="md:w-full w-[40rem]">
        <div className="flex w-full gap-3 items-center ">
          <Card className="w-[15rem]">
            <CardHeader>
              <CardTitle>Total Land</CardTitle>
              <CardDescription>in bigha</CardDescription>
            </CardHeader>
            <CardContent>110bigha</CardContent>
            <CardFooter>footer</CardFooter>
          </Card>
          <Card className="w-[15rem]">
            <CardHeader>
              <CardTitle>Total Houses</CardTitle>
              <CardDescription>in number</CardDescription>
            </CardHeader>
            <CardContent>20</CardContent>
            <CardFooter>footer</CardFooter>
          </Card>
          <Card className="w-[15rem]">
            <CardHeader>
              <CardTitle>Total Renters</CardTitle>
              <CardDescription>in number</CardDescription>
            </CardHeader>
            <CardContent>1000</CardContent>
            <CardFooter>footer</CardFooter>
          </Card>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Separator className="mt-5 mb-5" />
      <div className="flex gap-4 w-full max-sm:flex-col">
        <PaiChartComp />
        <BarChartComp />
      </div>
      <Separator className="mt-5 mb-5" />
      <div className="flex gap-4 w-full mt-5 max-md:flex-col">
        <div className="w-[50%] max-md:w-full">
          <h1>Manager List</h1>
          <DataTableDemo />
        </div>
        <div className="w-[50%] max-md:w-full">
          <h1>Renter List</h1>
          <DataTableDemo />
        </div>
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
