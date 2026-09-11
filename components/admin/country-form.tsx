"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveCountry, type CountryFormState } from "@/app/admin/(protected)/countries/actions";

const initialState: CountryFormState = { status: "idle" };

export function CountryForm({
  country,
}: {
  country?: { id: string; name: string; isoCode: string; flagEmoji: string | null };
}) {
  const [state, formAction, pending] = useActionState(saveCountry, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {country && <input type="hidden" name="countryId" value={country.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Country name</Label>
          <Input id="name" name="name" defaultValue={country?.name} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="isoCode">ISO code</Label>
          <Input
            id="isoCode"
            name="isoCode"
            defaultValue={country?.isoCode}
            maxLength={3}
            className="w-20 uppercase"
            placeholder="NG"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="flagEmoji">Flag</Label>
          <Input
            id="flagEmoji"
            name="flagEmoji"
            defaultValue={country?.flagEmoji ?? ""}
            className="w-16 text-center text-lg"
            placeholder="🏳️"
          />
        </div>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save country"}
      </Button>
    </form>
  );
}
