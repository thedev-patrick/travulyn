"use client";

import { Search } from "lucide-react";
import {
  Combobox,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxPopup,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { WORLD_COUNTRIES, flagEmojiFromIso, type WorldCountry } from "@/lib/world-countries";

type Item = { value: string; label: string };

const items: Item[] = WORLD_COUNTRIES.map((c) => ({
  value: c.isoCode,
  label: `${flagEmojiFromIso(c.isoCode)} ${c.name}`,
}));

export function CountryPicker({
  onSelect,
  defaultIsoCode,
}: {
  onSelect: (country: WorldCountry) => void;
  /** Pre-selects and pre-fills the input with this country, by ISO code. */
  defaultIsoCode?: string;
}) {
  const defaultItem = defaultIsoCode ? items.find((i) => i.value === defaultIsoCode) : undefined;

  return (
    <Combobox
      items={items}
      defaultValue={defaultItem}
      onValueChange={(item) => {
        const value = (item as Item | null)?.value;
        const country = WORLD_COUNTRIES.find((c) => c.isoCode === value);
        if (country) onSelect(country);
      }}
    >
      <ComboboxInputGroup>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <ComboboxInput placeholder="Search countries to autofill…" className="pl-8" />
        <ComboboxTrigger aria-label="Open country list" />
      </ComboboxInputGroup>
      <ComboboxPopup>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
