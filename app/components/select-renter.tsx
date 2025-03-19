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
import { loader } from "~/routes/dashboard.assign.create-assign";

type SelectRenterProps = {
  onChange: (id: string) => void; // Function to pass the selected renter ID to parent
};

const SelectRenter = ({ onChange }: SelectRenterProps) => {
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
          {value
            ? renter.find((r: any) => r.id.toString() === value)?.name
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
              {renter.map((r: any) => (
                <CommandItem
                  key={r.id}
                  value={r.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onChange(currentValue); // Pass selected ID to parent
                    setOpen(false);
                  }}
                >
                  {r.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === r.id.toString() ? "opacity-100" : "opacity-0"
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

export default SelectRenter;
