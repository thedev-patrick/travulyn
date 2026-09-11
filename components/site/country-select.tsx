"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CountryOption = { id: string; name: string; flagEmoji: string | null };

export function CountrySelect({
  name,
  id,
  countries,
  defaultValue,
  placeholder = "Select a country",
}: {
  name: string;
  id: string;
  countries: CountryOption[];
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder}>
          {(value: string | null) => {
            const country = countries.find((c) => c.id === value);
            return country ? `${country.flagEmoji ?? ""} ${country.name}` : placeholder;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.flagEmoji} {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
