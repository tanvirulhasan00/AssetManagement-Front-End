import React, { useState } from "react";

import {
  Calculator,
  Calendar,
  Check,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/dashboard.payment.create-payment";
import { cn } from "~/lib/utils";

type SelectRenterProps = {
  onChange: (id: string) => void; // Function to pass the selected renter ID to parent
};

const SearchReference = ({ onChange }: SelectRenterProps) => {
  const { assigns } = useLoaderData<typeof loader>();
  const [formData, setFormData] = useState("");
  const [show, setShow] = useState(false);
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput
        placeholder="Type a reference number"
        value={formData}
        onValueChange={(e) => (setFormData(e), setShow(false))}
      />
      <CommandList hidden={formData.length ? show : !show}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {assigns.map((assign: any) => (
            <CommandItem
              key={assign.id}
              onSelect={(currentValue) => {
                setFormData(currentValue === formData ? "" : currentValue);
                onChange(currentValue); // Pass selected ID to parent
                setShow(true);
              }}
            >
              {assign.referenceNo}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default SearchReference;
