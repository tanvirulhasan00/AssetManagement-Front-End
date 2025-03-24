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
            ? renter.find((r: any) => r.name.toString() === value)?.name
            : "Select renter"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[700px] max-sm:w-full">
        <Command>
          <CommandInput placeholder="Search renter..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Renter found.</CommandEmpty>
            <CommandGroup>
              {renter.map((r: any) => (
                <CommandItem
                  key={r.id}
                  value={r.name.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onChange(r.id); // Pass selected ID to parent
                    setOpen(false);
                  }}
                >
                  {r.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === r.name.toString() ? "opacity-100" : "opacity-0"
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
