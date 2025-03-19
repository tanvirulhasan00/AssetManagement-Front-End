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
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/dashboard.payment.create-payment";

type SelectRenterProps = {
  onChange: (id: string) => void; // Function to pass the selected renter ID to parent
};

const SelectRenterForPayment = ({ onChange }: SelectRenterProps) => {
  const { renters, assigns } = useLoaderData<typeof loader>();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? assigns.find((assign: any) => assign.id.toString() === value)
                ?.name
            : "Select renter"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[700px] max-sm:w-full">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Renter found.</CommandEmpty>
            <CommandGroup>
              {assigns.map((assign: any) => (
                <CommandItem
                  key={assign.id}
                  value={assign.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onChange(currentValue); // Pass selected ID to parent
                    setOpen(false);
                  }}
                >
                  {assign.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === assign.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
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
};

export default SelectRenterForPayment;
