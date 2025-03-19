// import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
// import { Form, useActionData } from "@remix-run/react";
// import { Search } from "lucide-react";
// import { GetAssign } from "~/components/data";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { authCookie } from "~/cookies.server";

// // export const loader = async ({ request }: LoaderFunctionArgs) => {};
// export const action = async ({ request }: ActionFunctionArgs) => {
//   const formData = await request.formData();
//   const formPayload = new FormData();
//   formPayload.append("referenceNo", formData.get("ref") as string);
//   const cookieHeader = request.headers.get("Cookie");
//   const token = (await authCookie.parse(cookieHeader)) || null;

//   const assignData = await GetAssign(formPayload, token);
//   const assign = await assignData.result;

//   return assign;
// };

// const PaymentSearch = () => {
//   const assign = useActionData<typeof action>();
//   return (
//     <div className="">
//       <Form method="post" className="flex gap-4 items-center">
//         <div className="relative max-w-sm">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//             size={18}
//           />
//           <Input
//             name="ref"
//             placeholder={"enter reference number"}
//             className="pl-10" // Push text to the right to make space for the icon
//           />
//         </div>
//         <Button type="submit">Payment Status</Button>
//       </Form>
//       <div>
//         <h1>Renter Name: {assign?.renter.name}</h1>
//         <h1>Flat Rent: {assign?.flatRent}</h1>
//         <h1>Flat Advance: {assign?.flat.flatAdvance}</h1>
//         <h1>Reference Number: {assign?.referenceNo}</h1>
//       </div>
//     </div>
//   );
// };

// export default PaymentSearch;

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
