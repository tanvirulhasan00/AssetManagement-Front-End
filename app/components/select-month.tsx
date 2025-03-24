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
import { useLoaderData } from "react-router";
import { loader } from "~/routes/dashboard.assign.create-assign";

type SelectRenterProps = {
  onChange: (id: string) => void; // Function to pass the selected renter ID to parent
};

const SelectMonth = ({ onChange }: SelectRenterProps) => {
  const { renter } = useLoaderData<typeof loader>();
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
          {value ? value : "Select month"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[700px] max-sm:w-full">
        <Command>
          <CommandInput placeholder="Search month..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Month found.</CommandEmpty>
            <CommandGroup>
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
                <CommandItem
                  key={index}
                  value={month}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onChange(month); // Pass selected ID to parent
                    setOpen(false);
                  }}
                >
                  {month}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === month ? "opacity-100" : "opacity-0"
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

export default SelectMonth;
