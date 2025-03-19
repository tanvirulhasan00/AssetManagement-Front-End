import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ModeToggle } from "~/components/mode-toggle";
import { ChangeEvent, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const SignUpForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [validPass, setValidPass] = useState("");
  const [isTouched, setIsTouched] = useState(false); // To track if input is touched

  const passwordHandlechange = (value: ChangeEvent<HTMLInputElement>) => {
    console.log("kk", value.target.value);
    const inputValue = value.target.value;
    setValidPass(inputValue);
    setIsTouched(true);
    if (!inputValue) {
      setIsTouched(false);
    }
  };
  const regex = /^(?=(.*[A-Z]))(?=(.*\d))(?=(.*\W))(?=.{6,})[A-Za-z\d\W]*$/;
  const isValidPass = regex.test(validPass) && validPass.length >= 6;
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Registration</CardTitle>
            <ModeToggle />
          </div>
          <CardDescription>Create account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" encType="multipart/form-data">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  onChange={(e) => passwordHandlechange(e)}
                  required
                />
                {isTouched &&
                  (isValidPass ? (
                    <div className="flex item-center gap-1 text-green-500">
                      <CheckCircle2 className="h-[10px] w-[10px] mt-1" />
                      <p className="text-[12px]">Valid password</p>
                    </div>
                  ) : (
                    <div className="flex item-center gap-1 text-red-500">
                      <AlertCircle className="h-[10px] w-[10px] mt-1" />
                      <p className="text-[12px]">Invalid password</p>
                    </div>
                  ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phonenumber">Phone Number</Label>
                <Input
                  id="phonenumber"
                  name="phonenumber"
                  type="text"
                  placeholder="phonenumber"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nidnumber">Nid Number</Label>
                <Input
                  id="nidnumber"
                  name="nidnumber"
                  type="text"
                  placeholder="nidnumber"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="eamil"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" placeholder="address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profilepicurl">Profile picture</Label>
                <Input
                  id="profilepicurl"
                  name="profilepicurl"
                  type="file"
                  placeholder="profilepic"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nidpicurl">Nid Picture</Label>
                <Input
                  id="nidpicurl"
                  name="nidpicurl"
                  type="file"
                  placeholder="nidpic"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Select name="active">
                  <SelectTrigger id="active">
                    <SelectValue placeholder="Select active status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={"1"}>Active</SelectItem>
                      <SelectItem value={"0"}>InActive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div> */}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
