"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CountryPicker } from "@/components/admin/country-picker";
import { flagEmojiFromIso, WORLD_COUNTRIES, type WorldCountry } from "@/lib/world-countries";
import { saveCountry, type CountryFormState } from "@/app/admin/(protected)/countries/actions";

const initialState: CountryFormState = { status: "idle" };

export function CountryForm({
  country,
}: {
  country?: { id: string; name: string; isoCode: string; flagEmoji: string | null };
}) {
  const [state, formAction, pending] = useActionState(saveCountry, initialState);
  const [selected, setSelected] = useState<WorldCountry | null>(() => {
    if (!country) return null;
    return WORLD_COUNTRIES.find((c) => c.isoCode === country.isoCode) ?? {
      name: country.name,
      isoCode: country.isoCode,
    };
  });

  return (
    <form action={formAction} className="grid gap-4">
      {country && <input type="hidden" name="countryId" value={country.id} />}
      <input type="hidden" name="name" value={selected?.name ?? ""} />
      <input type="hidden" name="isoCode" value={selected?.isoCode ?? ""} />
      <input type="hidden" name="flagEmoji" value={selected ? flagEmojiFromIso(selected.isoCode) : ""} />

      <div className="grid gap-1.5">
        <Label>Country</Label>
        <CountryPicker defaultIsoCode={country?.isoCode} onSelect={setSelected} />
        <p className="text-xs text-muted-foreground">
          Search and pick from the standard country list — name, ISO code, and flag are set together.
        </p>
      </div>

      {selected && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <span className="text-2xl">{flagEmojiFromIso(selected.isoCode)}</span>
          <div>
            <p className="text-sm font-medium">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.isoCode}</p>
          </div>
        </div>
      )}

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending || !selected} className="justify-self-start">
        {pending ? "Saving…" : "Save country"}
      </Button>
    </form>
  );
}
